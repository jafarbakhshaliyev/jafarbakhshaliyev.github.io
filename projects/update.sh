#!/bin/bash

# Set the working directory
cd /path/to/your/project

# Activate virtual environment if you're using one
# source venv/bin/activate

# Run the scraper
python scripts/scrape.py

# Run the processor
python scripts/process.py

# Log the update time
echo "Update completed at $(date)" >> logs/update.log