# packages/api-tools/app.py

import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()
app = Flask(__name__)
CORS(app)

# --- DATABASE & API INITIALIZATION ---
try:
    # Make sure 'serviceAccountKey.json' is in the same directory as app.py
    cred = credentials.Certificate('serviceAccountKey.json')
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("--- Firebase Connection: SUCCESS ---")
except Exception as e:
    db = None
    print(f"--- Firebase Connection: FAILED. Error: {e} ---")

try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file")
    genai.configure(api_key=gemini_api_key)
    print("--- Gemini API Configured: SUCCESS ---")
except Exception as e:
    print(f"--- Gemini API Configuration: FAILED. Error: {e} ---")

# --- NEW: CONTENT MANAGEMENT SYSTEM (CMS) ENDPOINTS ---
@app.route('/api/cms/posts', methods=['POST'])
def create_post():
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateCreated'] = firestore.SERVER_TIMESTAMP
        data['dateUpdated'] = firestore.SERVER_TIMESTAMP
        # Expected fields: title, slug, content, author, status ('draft'/'published')
        update_time, doc_ref = db.collection('cms_posts').add(data)
        return jsonify({"id": doc_ref.id}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

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

@app.route('/api/cms/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        doc_ref = db.collection('cms_posts').document(post_id)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({"error": "Post not found"}), 404
        post_data = doc.to_dict()
        post_data['id'] = doc.id
        return jsonify(post_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cms/posts/<post_id>', methods=['PUT'])
def update_post(post_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateUpdated'] = firestore.SERVER_TIMESTAMP
        db.collection('cms_posts').document(post_id).update(data)
        return jsonify({"message": "Post updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cms/posts/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        db.collection('cms_posts').document(post_id).delete()
        return jsonify({"message": "Post deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        projects = []
        docs = db.collection('projects').order_by('dateCreated', direction=firestore.Query.DESCENDING).stream()
        for doc in docs:
            project_data = doc.to_dict()
            project_data['id'] = doc.id
            projects.append(project_data)
        return jsonify(projects), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        doc_ref = db.collection('projects').document(project_id)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({"error": "Project not found"}), 404
        project_data = doc.to_dict()
        project_data['id'] = doc.id
        return jsonify(project_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['PUT'])
def update_project(project_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateUpdated'] = firestore.SERVER_TIMESTAMP
        db.collection('projects').document(project_id).update(data)
        return jsonify({"message": "Project updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        db.collection('projects').document(project_id).delete()
        return jsonify({"message": "Project deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        contacts = []
        docs = db.collection('crm_contacts').order_by('name').stream()
        for doc in docs:
            contact_data = doc.to_dict()
            contact_data['id'] = doc.id
            contacts.append(contact_data)
        return jsonify(contacts), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/crm/contacts/<contact_id>', methods=['PUT'])
def update_contact(contact_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['dateUpdated'] = firestore.SERVER_TIMESTAMP
        db.collection('crm_contacts').document(contact_id).update(data)
        return jsonify({"message": "Contact updated successfully"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/crm/contacts/<contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        db.collection('crm_contacts').document(contact_id).delete()
        return jsonify({"message": "Contact deleted successfully"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# --- COMMUNICATION LOG ENDPOINTS ---
@app.route('/api/crm/contacts/<contact_id>/logs', methods=['POST'])
def add_comm_log(contact_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        data = request.get_json()
        data['contactId'] = contact_id
        data['timestamp'] = firestore.SERVER_TIMESTAMP
        update_time, doc_ref = db.collection('comm_logs').add(data)
        return jsonify({"id": doc_ref.id}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/crm/contacts/<contact_id>/logs', methods=['GET'])
def get_comm_logs(contact_id):
    if not db: return jsonify({"error": "Database not connected"}), 500
    try:
        logs = []
        log_ref = db.collection('comm_logs').where('contactId', '==', contact_id).order_by('timestamp', direction=firestore.Query.DESCENDING)
        docs = log_ref.stream()
        for doc in docs:
            log_data = doc.to_dict()
            log_data['id'] = doc.id
            logs.append(log_data)
        return jsonify(logs), 200
    except Exception as e: return jsonify({"error": str(e)}), 500
        
# --- GSC DATA ENDPOINTS ---
@app.route('/api/get-gsc-data', methods=['GET'])
def get_gsc_data():
    if not db: return jsonify({"message": "Database error"}), 500
    doc_ref = db.collection('sem37_data').document('gsc_main')
    doc = doc_ref.get()
    return jsonify(doc.to_dict() if doc.exists else {"lastUpdated": "No data"}), 200

# --- GEMINI SEO ANALYZER ENDPOINT ---
@app.route('/api/gemini-seo-analysis', methods=['GET'])
def get_gemini_seo_analysis():
    domain = request.args.get('domain')
    if not domain: return jsonify({"error": "A 'domain' is required."}), 400
    if not gemini_api_key: return jsonify({"error": "Gemini API key not configured"}), 500
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    prompt = f"""
    You are a world-class SEO and market analyst. Your task is to provide a deeply researched, plausible estimate of key performance indicators for the domain: '{domain}'.
    Analytical Steps You Must Follow:
    1. Assess the Domain's Scale (e.g., small local business vs. global enterprise).
    2. Factor in the domain's likely market, authority, and industry competitiveness.
    3. Generate a plausible 12-month history for organic traffic.
    Output Instructions:
    - Your response MUST be a single, minified JSON object and nothing else.
    - The JSON object must contain these exact keys: "organicKeywords", "monthlySEOClicks", "monthlySEOClickChange", "paidKeywords", "monthlyPPCClicks", "monthlyAdsBudget", "trafficHistory" (an array of 12 objects with "month" and "organicTraffic" keys).
    CRITICAL: The values MUST be tailored specifically to the analyzed domain.
    """
    try:
        response = model.generate_content(prompt)
        raw_text = response.text
        start_index = raw_text.find('{')
        end_index = raw_text.rfind('}') + 1
        if start_index == -1 or end_index == 0: raise ValueError("Invalid JSON")
        json_string = raw_text[start_index:end_index]
        data = json.loads(json_string)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "AI response error", "details": str(e)}), 500

if __name__ == '__main__':
    # Use 0.0.0.0 to make it accessible on your local network
    app.run(host='0.0.0.0', port=5001, debug=True)