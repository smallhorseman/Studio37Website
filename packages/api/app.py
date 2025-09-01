import os
import jwt
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai

# --- Initialization ---
load_dotenv()
app = Flask(__name__)
CORS(app)

# --- Firebase Initialization ---
db = None
SERVICE_ACCOUNT_FILE = 'serviceAccountKey.json'
if not os.path.exists(SERVICE_ACCOUNT_FILE):
    print(f"--- FATAL ERROR: Firebase credentials ('{SERVICE_ACCOUNT_FILE}') not found. ---")
else:
    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
        firebase_admin.initialize_app(cred, name='api-service')
        db = firestore.client()
        print("--- API Firebase Connection: SUCCESS ---")
    except Exception as e:
        print(f"--- API Firebase Connection: FAILED. Error: {e} ---")

# --- Gemini API Initialization ---
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file")
    genai.configure(api_key=gemini_api_key)
    print("--- Gemini API Configured: SUCCESS ---")
except Exception as e:
    print(f"--- Gemini API Configuration: FAILED. Error: {e} ---")


# --- JWT Token Verification Decorator ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token format is invalid!'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            secret_key = os.getenv('JWT_SECRET')
            jwt.decode(token, secret_key, algorithms=["HS256"])
        except Exception as e:
            return jsonify({'message': f'Token is invalid! {e}'}), 401

        return f(*args, **kwargs)
    return decorated


# --- Health Check Endpoint ---
@app.route('/')
def index():
    return jsonify({"status": "ok", "message": "Studio37 Data API is running."})


# --- CMS ENDPOINTS ---
@app.route('/api/cms/posts', methods=['POST'])
@token_required
def create_post():
    # ... function logic ...
    pass

@app.route('/api/cms/posts', methods=['GET'])
@token_required
def get_all_posts():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        posts = [doc.to_dict() | {'id': doc.id} for doc in db.collection('cms_posts').stream()]
        return jsonify(posts), 200
    except Exception as e: return jsonify({"error": str(e)}), 500


# --- PROJECT ENDPOINTS ---
@app.route('/api/projects', methods=['GET'])
@token_required
def get_all_projects():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        projects = [doc.to_dict() | {'id': doc.id} for doc in db.collection('projects').stream()]
        return jsonify(projects), 200
    except Exception as e: return jsonify({"error": str(e)}), 500


# --- CRM ENDPOINTS ---
@app.route('/api/crm/contacts', methods=['GET'])
@token_required
def get_all_contacts():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        contacts = [doc.to_dict() | {'id': doc.id} for doc in db.collection('crm_contacts').stream()]
        return jsonify(contacts), 200
    except Exception as e: return jsonify({"error": str(e)}), 500


# --- GSC DATA ENDPOINTS ---
@app.route('/api/get-gsc-data', methods=['GET'])
@token_required
def get_gsc_data():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        doc_ref = db.collection('sem37_data').document('gsc_main')
        doc = doc_ref.get()
        return jsonify(doc.to_dict() if doc.exists else {"message": "No GSC data found"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500


# --- GEMINI SEO ANALYZER ENDPOINT ---
@app.route('/api/gemini-seo-analysis', methods=['GET'])
@token_required
def get_gemini_seo_analysis():
    domain = request.args.get('domain')
    if not domain: return jsonify({"error": "A 'domain' is required."}), 400
    # ... your Gemini prompt logic ...
    return jsonify({"message": f"Analysis for {domain} would be generated here."}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)