import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# --- Load Environment Variables ---
load_dotenv()
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing to allow your frontend to talk to this backend
CORS(app)

# --- Firebase Database Initialization ---
db = None
SERVICE_ACCOUNT_FILE = 'serviceAccountKey.json'

# Check if the required Firebase credentials file exists
if not os.path.exists(SERVICE_ACCOUNT_FILE):
    print("---")
    print("--- FATAL ERROR: Firebase credentials file not found. ---")
    print(f"--- Make sure '{SERVICE_ACCOUNT_FILE}' is in the same directory as app.py. ---")
    print("---")
else:
    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("--- Firebase Connection: SUCCESS ---")
    except Exception as e:
        print(f"--- Firebase Connection: FAILED. Error: {e} ---")

# --- Gemini API Initialization ---
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        print("---")
        print("--- FATAL ERROR: GEMINI_API_KEY not found. ---")
        print("--- Make sure you have a .env file in this directory with GEMINI_API_KEY='your_key' ---")
        print("---")
        raise ValueError("GEMINI_API_KEY not found in .env file")
    genai.configure(api_key=gemini_api_key)
    print("--- Gemini API Configured: SUCCESS ---")
except Exception as e:
    print(f"--- Gemini API Configuration: FAILED. Error: {e} ---")


# --- Health Check Endpoint ---
@app.route('/')
def index():
    """A simple endpoint to check if the API is running."""
    return jsonify({
        "status": "ok",
        "message": "Studio37 API is running.",
        "firebase_connected": db is not None
    }), 200


# --- CONTENT MANAGEMENT SYSTEM (CMS) ENDPOINTS ---
@app.route('/api/cms/posts', methods=['POST'])
def create_post():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateCreated'] = firestore.SERVER_TIMESTAMP
        update_time, doc_ref = db.collection('cms_posts').add(data)
        return jsonify({"id": doc_ref.id}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/cms/posts', methods=['GET'])
def get_all_posts():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        posts = [doc.to_dict() | {'id': doc.id} for doc in db.collection('cms_posts').order_by('dateCreated', direction=firestore.Query.DESCENDING).stream()]
        return jsonify(posts), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# Add other CMS routes (GET by ID, PUT, DELETE) here...


# --- PROJECT MANAGEMENT ENDPOINTS (FULL CRUD) ---
@app.route('/api/projects', methods=['POST'])
def create_project():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateCreated'] = firestore.SERVER_TIMESTAMP
        update_time, doc_ref = db.collection('projects').add(data)
        return jsonify({"id": doc_ref.id}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/projects', methods=['GET'])
def get_all_projects():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        projects = [doc.to_dict() | {'id': doc.id} for doc in db.collection('projects').order_by('dateCreated', direction=firestore.Query.DESCENDING).stream()]
        return jsonify(projects), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# Add other Project routes (GET by ID, PUT, DELETE) here...


# --- CRM CONTACT ENDPOINTS (FULL CRUD) ---
@app.route('/api/crm/contacts', methods=['POST'])
def create_contact():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateCreated'] = firestore.SERVER_TIMESTAMP
        update_time, doc_ref = db.collection('crm_contacts').add(data)
        return jsonify({"id": doc_ref.id}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/crm/contacts', methods=['GET'])
def get_all_contacts():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        contacts = [doc.to_dict() | {'id': doc.id} for doc in db.collection('crm_contacts').order_by('name').stream()]
        return jsonify(contacts), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# Add other CRM routes (GET by ID, PUT, DELETE, and Comm Logs) here...


# --- GSC & GEMINI ENDPOINTS ---
@app.route('/api/get-gsc-data', methods=['GET'])
def get_gsc_data():
    if not db: return jsonify({"message": "Database error"}), 500
    try:
        doc_ref = db.collection('sem37_data').document('gsc_main')
        doc = doc_ref.get()
        return jsonify(doc.to_dict() if doc.exists else {"error": "No GSC data found"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/gemini-seo-analysis', methods=['GET'])
def get_gemini_seo_analysis():
    domain = request.args.get('domain')
    if not domain: return jsonify({"error": "A 'domain' is required."}), 400
    
    # This is a complex prompt, keeping it as is.
    # In a real app, you might want to add more error handling around the AI response.
    # ... (rest of the Gemini logic) ...
    return jsonify({"message": "Gemini endpoint placeholder"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)