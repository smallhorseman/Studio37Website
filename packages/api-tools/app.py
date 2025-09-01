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
CORS(app)

# --- UPDATED: More Robust Firebase Initialization ---
db = None
SERVICE_ACCOUNT_FILE = 'serviceAccountKey.json'

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

# --- UPDATED: More Robust Gemini API Initialization ---
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

# --- NEW: Health Check Endpoint ---
@app.route('/')
def index():
    """A simple endpoint to check if the API is running."""
    return jsonify({
        "status": "ok",
        "message": "Studio37 API is running.",
        "firebase_connected": db is not None
    }), 200

# --- CONTENT MANAGEMENT SYSTEM (CMS) ENDPOINTS ---
@app.route('/api/cms/posts', methods=['GET'])
def get_all_posts():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        posts = []
        docs = db.collection('cms_posts').order_by('dateCreated', direction=firestore.Query.DESCENDING).stream()
        for doc in docs:
            post_data = doc.to_dict()
            post_data['id'] = doc.id
            posts.append(post_data)
        return jsonify(posts), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# ... (All your other API routes for CMS, Projects, CRM, etc., remain the same)
# ... (GET /api/cms/posts/<post_id>, POST /api/cms/posts, etc.)

# --- PROJECT MANAGEMENT ENDPOINTS (FULL CRUD) ---
@app.route('/api/projects', methods=['GET'])
def get_all_projects():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        projects = []
        docs = db.collection('projects').order_by('dateCreated', direction=firestore.Query.DESCENDING).stream()
        for doc in docs:
            project_data = doc.to_dict()
            project_data['id'] = doc.id
            projects.append(project_data)
        return jsonify(projects), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# ... (All other project routes)

# --- CRM CONTACT ENDPOINTS (FULL CRUD) ---
@app.route('/api/crm/contacts', methods=['GET'])
def get_all_contacts():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        contacts = []
        docs = db.collection('crm_contacts').order_by('name').stream()
        for doc in docs:
            contact_data = doc.to_dict()
            contact_data['id'] = doc.id
            contacts.append(contact_data)
        return jsonify(contacts), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# ... (All other CRM routes)

# --- GSC & GEMINI ENDPOINTS ---
@app.route('/api/get-gsc-data', methods=['GET'])
def get_gsc_data():
    if not db: return jsonify({"message": "Database error"}), 500
    doc_ref = db.collection('sem37_data').document('gsc_main')
    doc = doc_ref.get()
    return jsonify(doc.to_dict() if doc.exists else {"lastUpdated": "No data"}), 200

@app.route('/api/gemini-seo-analysis', methods=['GET'])
def get_gemini_seo_analysis():
    # ... (Gemini route logic remains the same)
    pass # Placeholder for brevity

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)