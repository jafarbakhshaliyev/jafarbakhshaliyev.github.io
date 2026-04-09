import os
import re
import time
import requests
from pathlib import Path
from bs4 import BeautifulSoup

#
# --- PART 1: SCRAPING ALL TRANSCRIPT LINKS FROM THE MAIN PODCAST PAGE ---
#
def scrape_main_podcast_page(main_podcast_url: str) -> list:
    """
    Scrape the main Lex Fridman podcast page (e.g. https://lexfridman.com/podcast/)
    Return a list of transcript URLs found on that page.
    """
    try:
        response = requests.get(main_podcast_url)
        response.raise_for_status()
    except Exception as e:
        print(f"[ERROR] Could not fetch {main_podcast_url}: {e}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")

    # Each episode's links (Video, Episode, Transcript) often appear in <div class="vid-materials">
    episode_blocks = soup.find_all("div", class_="vid-materials")

    transcript_urls = []
    for block in episode_blocks:
        # Look for an <a> link whose visible text is "Transcript"
        # We'll do a case-insensitive match.
        link_tag = block.find("a", string=re.compile(r"Transcript", re.IGNORECASE))
        if link_tag:
            transcript_href = link_tag.get("href")
            if transcript_href and transcript_href.startswith("http"):
                transcript_urls.append(transcript_href)

    return transcript_urls

#
# --- PART 2: SCRAPING & CLEANING A SINGLE TRANSCRIPT PAGE ---
#
def remove_until_introduction(text: str) -> str:
    """
    Removes everything before the first occurrence of a line that starts with 'Introduction'.
    Returns the text from 'Introduction' onward (including 'Introduction' line).
    If 'Introduction' is not found, returns the original text.
    """
    lines = text.splitlines()
    introduction_index = None

    for i, line in enumerate(lines):
        if line.strip().startswith("Introduction"):
            introduction_index = i
            break

    if introduction_index is None:
        return text  # 'Introduction' not found

    return "\n".join(lines[introduction_index:])

def remove_extra_blank_lines(text: str) -> str:
    """
    Remove extra blank lines from 'text'.
    We keep lines that have content, and remove lines that are purely whitespace or empty.
    """
    lines = text.splitlines()
    filtered = [line.strip() for line in lines if line.strip() != ""]
    return "\n".join(filtered)

def scrape_and_clean_transcript(transcript_url: str) -> str:
    """
    Given a transcript URL, scrape the text from <div class="entry-content">,
    remove everything before 'Introduction', remove extra blank lines,
    and return the cleaned text.
    """
    try:
        response = requests.get(transcript_url)
        response.raise_for_status()
    except Exception as e:
        print(f"[ERROR] Could not fetch {transcript_url}: {e}")
        return ""

    soup = BeautifulSoup(response.text, "html.parser")
    transcript_div = soup.find("div", class_="entry-content")
    if not transcript_div:
        print(f"[WARNING] Could not find transcript container in {transcript_url}")
        return ""

    raw_text = transcript_div.get_text(separator="\n").strip()

    # Remove everything before 'Introduction'
    text_from_intro = remove_until_introduction(raw_text)

    # Remove extra blank lines
    final_text = remove_extra_blank_lines(text_from_intro)

    return final_text

def is_timestamp_line(line: str) -> bool:
    """
    Checks if a line matches (HH:MM:SS) or variations like (H:MM:SS).
    Example: (00:00:10), (1:02:13), etc.
    """
    return bool(re.match(r"^\(\d{1,2}:\d{2}:\d{2}\)$", line.strip()))

def is_likely_speaker_line(line: str, next_line: str) -> bool:
    """
    Heuristic: True if 'line' is short, probably a person's name,
    AND the next line is a timestamp line.
    """
    # 1) Check if next_line is a timestamp
    if not is_timestamp_line(next_line):
        return False

    # 2) Check if line has 1-3 words, each capitalized or mostly so
    words = line.strip().split()
    if not (1 <= len(words) <= 3):
        return False

    # 3) Disqualify if it has digits or weird punctuation
    if re.search(r"\d", line):
        return False

    # 4) Basic check: each word starts uppercase or so
    for w in words:
        # if w is "Lex" -> w[0] = 'L', w[1:] = 'ex'
        if not w or not w[0].isupper():
            return False

    return True

def reformat_transcript_dynamic(lines):
    """
    Reads lines from a transcript where lines are in the form:
      SpeakerName
      (HH:MM:SS)
      Some text...
    and converts them into:
      [HH:MM:SS] SpeakerName: Some text...
    without needing a pre-defined speaker set.
    """
    output_lines = []
    speaker = None
    timestamp = None
    buffer_for_text = []

    i = 0
    n = len(lines)

    while i < n:
        line = lines[i].strip()

        # We'll peek ahead if possible
        next_line = lines[i+1].strip() if (i+1 < n) else ""

        # Check if this line is a "likely speaker line"
        if is_likely_speaker_line(line, next_line):
            # If we have an existing chunk, finalize it
            if speaker and timestamp and buffer_for_text:
                combined_text = " ".join(buffer_for_text).strip()
                output_lines.append(f"[{timestamp}] {speaker}: {combined_text}")

            # Set the new speaker
            speaker = line.strip()

            # Move to the next line (which we know is a timestamp)
            i += 1
            timestamp_line = lines[i].strip()  # e.g. (00:05:08)
            timestamp = timestamp_line.strip("()")
            buffer_for_text = []
            i += 1  # move on past the timestamp line

        elif is_timestamp_line(line):
            # If we see a timestamp line unexpectedly, finalize previous chunk
            if speaker and timestamp and buffer_for_text:
                combined_text = " ".join(buffer_for_text).strip()
                output_lines.append(f"[{timestamp}] {speaker}: {combined_text}")

            # We set the new timestamp, but no new speaker was identified
            timestamp = line.strip("()")
            buffer_for_text = []
            i += 1

        else:
            # Regular text line -> accumulate it
            buffer_for_text.append(line)
            i += 1

    # Flush any remaining buffer
    if speaker and timestamp and buffer_for_text:
        combined_text = " ".join(buffer_for_text).strip()
        output_lines.append(f"[{timestamp}] {speaker}: {combined_text}")

    return output_lines

def convert_transcript_to_bracketed_format(raw_text: str) -> str:
    # Split into lines, remove empty
    lines = [ln for ln in raw_text.splitlines() if ln.strip() != ""]
    # Reformat
    bracketed_lines = reformat_transcript_dynamic(lines)
    if not bracketed_lines:
        return raw_text  # fallback
    return "\n".join(bracketed_lines)


def main():
    main_url = "https://lexfridman.com/podcast/"
    transcript_dir = Path("transcripts")
    transcript_dir.mkdir(exist_ok=True)

    transcript_links = scrape_main_podcast_page(main_url)
    print(f"Found {len(transcript_links)} transcript link(s).")

    for i, t_url in enumerate(transcript_links, start=1):
        filename_part = t_url.split("/")[-1]
        filepath = transcript_dir / f"{filename_part}.txt"

        if filepath.exists():
            print(f"[SKIP] Transcript already exists: {filepath}")
            continue

        print(f"[INFO] Processing transcript: {t_url}")
        time.sleep(2)
        cleaned_text = scrape_and_clean_transcript(t_url)
        if not cleaned_text:
            print(f"[WARNING] No transcript text found at {t_url}")
            continue

        bracketed_text = convert_transcript_to_bracketed_format(cleaned_text)

        with filepath.open("w", encoding="utf-8") as f:
            f.write(bracketed_text)

        print(f"[OK] Saved transcript to {filepath}")

if __name__ == "__main__":
    main()