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
SERVICE_ACCOUNT_FILE = os.getenv('FIREBASE_CREDENTIALS_PATH')
if SERVICE_ACCOUNT_FILE and os.path.exists(SERVICE_ACCOUNT_FILE):
    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
        api_app = firebase_admin.initialize_app(cred, name='api-service')
        db = firestore.client(app=api_app)
        print("--- API Firebase Connection: SUCCESS ---")
    except Exception as e:
        print(f"--- API Firebase Connection: FAILED. Error: {e} ---")
else:
    print(f"--- FATAL ERROR: Firebase credentials path not set or file not found. ---")

# --- JWT Token Verification Decorator ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except IndexError: return jsonify({'message': 'Token format is invalid!'}), 401
        if not token: return jsonify({'message': 'Token is missing!'}), 401
        try:
            secret_key = os.getenv('JWT_SECRET')
            jwt.decode(token, secret_key, algorithms=["HS256"])
        except Exception: return jsonify({'message': 'Token is invalid or expired!'}), 401
        return f(*args, **kwargs)
    return decorated

# --- Generic CRUD Function ---
def generic_crud(collection_name, doc_id=None, method='GET', data=None):
    if not db: return {"error": "Database not connected"}, 500
    try:
        collection = db.collection(collection_name)
        if method == 'POST':
            data['dateCreated'] = firestore.SERVER_TIMESTAMP
            collection.add(data)
            return {"message": "Created successfully"}, 201
        elif method == 'GET':
            docs = [doc.to_dict() | {'id': doc.id} for doc in collection.stream()]
            return docs, 200
        elif method == 'PUT' and doc_id:
            data['dateUpdated'] = firestore.SERVER_TIMESTAMP
            collection.document(doc_id).update(data)
            return {"message": "Updated successfully"}, 200
        elif method == 'DELETE' and doc_id:
            collection.document(doc_id).delete()
            return {"message": "Deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500

# --- Health Check Endpoint ---
@app.route('/')
def index():
    return jsonify({"status": "ok", "message": "Studio37 Data API is running."})
# --- SEO ANALYSIS ENDPOINT ---
@app.route('/api/analyze-seo', methods=['GET'])
@token_required
def analyze_seo():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "URL parameter is missing"}), 400
    
    seo_analysis_data = analyze_on_page_seo(url)
    
    if 'error' in seo_analysis_data:
        return jsonify(seo_analysis_data), 500
    
    return jsonify(seo_analysis_data), 200

# Make sure you import the function at the top of your file
# from scrapper import analyze_on_page_seo
# --- CMS ENDPOINTS (FULL CRUD) ---
@app.route('/api/cms/posts', methods=['POST', 'GET'])
@token_required
def handle_cms_posts():
    if request.method == 'POST':
        message, status = generic_crud('cms_posts', method='POST', data=request.get_json())
    else:
        message, status = generic_crud('cms_posts', method='GET')
    return jsonify(message), status

@app.route('/api/cms/posts/<post_id>', methods=['PUT', 'DELETE'])
@token_required
def handle_cms_post(post_id):
    if request.method == 'PUT':
        message, status = generic_crud('cms_posts', doc_id=post_id, method='PUT', data=request.get_json())
    else:
        message, status = generic_crud('cms_posts', doc_id=post_id, method='DELETE')
    return jsonify(message), status

# --- PROJECT ENDPOINTS (FULL CRUD) ---
@app.route('/api/projects', methods=['POST', 'GET'])
@token_required
def handle_projects():
    if request.method == 'POST':
        message, status = generic_crud('projects', method='POST', data=request.get_json())
    else:
        message, status = generic_crud('projects', method='GET')
    return jsonify(message), status

@app.route('/api/projects/<project_id>', methods=['PUT', 'DELETE'])
@token_required
def handle_project(project_id):
    if request.method == 'PUT':
        message, status = generic_crud('projects', doc_id=project_id, method='PUT', data=request.get_json())
    else:
        message, status = generic_crud('projects', doc_id=project_id, method='DELETE')
    return jsonify(message), status

# --- CRM ENDPOINTS (FULL CRUD) ---
@app.route('/api/crm/contacts', methods=['POST', 'GET'])
@token_required
def handle_crm_contacts():
    if request.method == 'POST':
        message, status = generic_crud('crm_contacts', method='POST', data=request.get_json())
    else:
        message, status = generic_crud('crm_contacts', method='GET')
    return jsonify(message), status

@app.route('/api/crm/contacts/<contact_id>', methods=['PUT', 'DELETE'])
@token_required
def handle_crm_contact(contact_id):
    if request.method == 'PUT':
        message, status = generic_crud('crm_contacts', doc_id=contact_id, method='PUT', data=request.get_json())
    else:
        message, status = generic_crud('crm_contacts', doc_id=contact_id, method='DELETE')
    return jsonify(message), status

# --- TASK ENDPOINTS (FULL CRUD) ---
@app.route('/api/tasks', methods=['POST', 'GET'])
@token_required
def handle_tasks():
    if request.method == 'POST':
        message, status = generic_crud('tasks', method='POST', data=request.get_json())
    else:
        message, status = generic_crud('tasks', method='GET')
    return jsonify(message), status

@app.route('/api/tasks/<task_id>', methods=['PUT', 'DELETE'])
@token_required
def handle_task(task_id):
    if request.method == 'PUT':
        message, status = generic_crud('tasks', doc_id=task_id, method='PUT', data=request.get_json())
    else:
        message, status = generic_crud('tasks', doc_id=task_id, method='DELETE')
    return jsonify(message), status

# --- GSC DATA ENDPOINTS ---
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
# --- GEMINI ENDPOINT ---
@app.route('/api/gemini/generate', methods=['POST'])
@token_required
def generate_text():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        if not prompt:
            return jsonify({"error": "Prompt is missing"}), 400

        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)

        return jsonify({"generated_text": response.text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)