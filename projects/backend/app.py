from flask import Flask, request, jsonify
from flask_cors import CORS
from process import TranscriptAnalyzer  # Your existing analyzer
import os

app = Flask(__name__)
CORS(app)

# Initialize the analyzer
analyzer = TranscriptAnalyzer(
    embed_model_name="sentence-transformers/all-MiniLM-L6-v2",
    llm_type="llama",
    llm_model_path=os.getenv('MODEL_PATH', 'path/to/your/model.gguf')
)

# Load the index when the server starts
@app.before_first_request
def load_index():
    analyzer.build_index("data/transcripts")

@app.route('/api/search', methods=['POST'])
def search():
    try:
        data = request.get_json()
        query = data.get('query')
        top_k = data.get('top_k', 5)
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
            
        results = analyzer.answer_question(query, top_k)
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)