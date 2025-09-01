import os
import jwt
import json
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
if os.path.exists(SERVICE_ACCOUNT_FILE):
    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
        api_app = firebase_admin.initialize_app(cred, name='api-service')
        db = firestore.client(app=api_app)
        print("--- API Firebase Connection: SUCCESS ---")
    except Exception as e:
        print(f"--- API Firebase Connection: FAILED. Error: {e} ---")
else:
    print(f"--- FATAL ERROR: Firebase credentials ('{SERVICE_ACCOUNT_FILE}') not found. ---")

# --- Gemini API Initialization ---
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key: raise ValueError("GEMINI_API_KEY not found in .env file")
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
            return jsonify({'message': f'Token is invalid or expired! {e}'}), 401
        return f(*args, **kwargs)
    return decorated

# --- Health Check Endpoint ---
@app.route('/')
def index():
    return jsonify({"status": "ok", "message": "Studio37 Data API is running."})

# --- CMS ENDPOINTS (FULL CRUD) ---
@app.route('/api/cms/posts', methods=['POST'])
@token_required
def create_post():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateCreated'] = firestore.SERVER_TIMESTAMP
        db.collection('cms_posts').add(data)
        return jsonify({"message": "Post created successfully"}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/cms/posts', methods=['GET'])
@token_required
def get_all_posts():
    if not db: return jsonify({"error": "Database not connected"}), 500
    posts = [doc.to_dict() | {'id': doc.id} for doc in db.collection('cms_posts').stream()]
    return jsonify(posts), 200

@app.route('/api/cms/posts/<post_id>', methods=['GET'])
@token_required
def get_post(post_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    doc = db.collection('cms_posts').document(post_id).get()
    return jsonify(doc.to_dict() | {'id': doc.id}) if doc.exists else (jsonify({"error": "Post not found"}), 404)

@app.route('/api/cms/posts/<post_id>', methods=['PUT'])
@token_required
def update_post(post_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateUpdated'] = firestore.SERVER_TIMESTAMP
        db.collection('cms_posts').document(post_id).update(data)
        return jsonify({"message": "Post updated successfully"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/cms/posts/<post_id>', methods=['DELETE'])
@token_required
def delete_post(post_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        db.collection('cms_posts').document(post_id).delete()
        return jsonify({"message": "Post deleted successfully"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# --- PROJECT ENDPOINTS (FULL CRUD) ---
@app.route('/api/projects', methods=['POST'])
@token_required
def create_project():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateCreated'] = firestore.SERVER_TIMESTAMP
        db.collection('projects').add(data)
        return jsonify({"message": "Project created successfully"}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/projects', methods=['GET'])
@token_required
def get_all_projects():
    if not db: return jsonify({"error": "Database not connected"}), 500
    projects = [doc.to_dict() | {'id': doc.id} for doc in db.collection('projects').stream()]
    return jsonify(projects), 200

@app.route('/api/projects/<project_id>', methods=['GET'])
@token_required
def get_project(project_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    doc = db.collection('projects').document(project_id).get()
    return jsonify(doc.to_dict() | {'id': doc.id}) if doc.exists else (jsonify({"error": "Project not found"}), 404)

@app.route('/api/projects/<project_id>', methods=['PUT'])
@token_required
def update_project(project_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateUpdated'] = firestore.SERVER_TIMESTAMP
        db.collection('projects').document(project_id).update(data)
        return jsonify({"message": "Project updated successfully"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['DELETE'])
@token_required
def delete_project(project_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        db.collection('projects').document(project_id).delete()
        return jsonify({"message": "Project deleted successfully"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# --- CRM ENDPOINTS (FULL CRUD) ---
@app.route('/api/crm/contacts', methods=['POST'])
@token_required
def create_contact():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateCreated'] = firestore.SERVER_TIMESTAMP
        db.collection('crm_contacts').add(data)
        return jsonify({"message": "Contact created successfully"}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/crm/contacts', methods=['GET'])
@token_required
def get_all_contacts():
    if not db: return jsonify({"error": "Database not connected"}), 500
    contacts = [doc.to_dict() | {'id': doc.id} for doc in db.collection('crm_contacts').stream()]
    return jsonify(contacts), 200

@app.route('/api/crm/contacts/<contact_id>', methods=['GET'])
@token_required
def get_contact(contact_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    doc = db.collection('crm_contacts').document(contact_id).get()
    return jsonify(doc.to_dict() | {'id': doc.id}) if doc.exists else (jsonify({"error": "Contact not found"}), 404)

@app.route('/api/crm/contacts/<contact_id>', methods=['PUT'])
@token_required
def update_contact(contact_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateUpdated'] = firestore.SERVER_TIMESTAMP
        db.collection('crm_contacts').document(contact_id).update(data)
        return jsonify({"message": "Contact updated successfully"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/crm/contacts/<contact_id>', methods=['DELETE'])
@token_required
def delete_contact(contact_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        db.collection('crm_contacts').document(contact_id).delete()
        return jsonify({"message": "Contact deleted successfully"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# --- GSC & GEMINI ENDPOINTS ---
@app.route('/api/get-gsc-data', methods=['GET'])
@token_required
def get_gsc_data():
    if not db: return jsonify({"error": "Database not connected"}), 500
    doc_ref = db.collection('sem37_data').document('gsc_main')
    doc = doc_ref.get()
    return jsonify(doc.to_dict() if doc.exists else {"message": "No GSC data found"}), 200

@app.route('/api/update-gsc-data', methods=['POST'])
@token_required
def update_gsc_data():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        db.collection('sem37_data').document('gsc_main').set(data, merge=True)
        return jsonify({"message": "GSC data updated successfully"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/gemini-seo-analysis', methods=['GET'])
@token_required
def get_gemini_seo_analysis():
    domain = request.args.get('domain')
    if not domain: return jsonify({"error": "A 'domain' is required."}), 400
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    prompt = f"You are a world-class SEO analyst. Provide a plausible, deeply researched estimate of key performance indicators for the domain: '{domain}'. Your response MUST be a single, minified JSON object with these exact keys: 'organicKeywords', 'monthlySEOClicks', 'monthlySEOClickChange', 'paidKeywords', 'monthlyPPCClicks', 'monthlyAdsBudget', 'trafficHistory' (an array of 12 objects with 'month' and 'organicTraffic' keys)."
    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip().replace('`', '')
        if raw_text.startswith('json'):
            raw_text = raw_text[4:].strip()
        data = json.loads(raw_text)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "AI response error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)