from flask import Flask, request, jsonify
from flask_cors import CORS
from scrapper import analyze_on_page_seo

# Create the Flask app
app = Flask(__name__)
# Enable CORS for all routes, allowing our frontend to connect
CORS(app)

@app.route('/on_page_seo_check', methods=['POST'])
def on_page_seo_check():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    analysis_data = analyze_on_page_seo(url)
    
    if 'error' in analysis_data:
        return jsonify(analysis_data), 500

    return jsonify(analysis_data)

# This allows the app to be run directly with `python3 app.py`
if __name__ == '__main__':
    app.run(debug=True, port=5000)
