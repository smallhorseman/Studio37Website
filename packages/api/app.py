import os
import jwt
from functools import wraps
from flask import Flask, jsonify, request
from firebase_admin import credentials, firestore, initialize_app
from scrapper import analyze_on_page_seo
from flask_cors import CORS

# --- Initialization ---
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize Firestore
cred = credentials.Certificate('serviceAccountKey.json')
initialize_app(cred)
db = firestore.client()

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
            # FIX: Load secret from environment variable for security
            secret_key = os.getenv('JWT_SECRET')
            if not secret_key:
                print("--- FATAL: JWT_SECRET environment variable not set. ---")
                return jsonify({'message': 'Server configuration error'}), 500
            jwt.decode(token, secret_key, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        except Exception: return jsonify({'message': 'Token validation failed!'}), 401
        return f(*args, **kwargs)
    return decorated

# --- Generic CRUD Function ---
def generic_crud(collection_name, doc_id=None, method='GET', data=None):
    try:
        collection = db.collection(collection_name)
        if method == 'GET':
            if doc_id:
                doc = collection.document(doc_id).get()
                return (doc.to_dict(), 200) if doc.exists else ({'error': 'Not found'}, 404)
            else:
                all_docs = [doc.to_dict() for doc in collection.stream()]
                return (all_docs, 200)
        elif method == 'POST':
            collection.add(data)
            return ({'message': 'Successfully created'}, 201)
        elif method == 'PUT':
            collection.document(doc_id).set(data)
            return ({'message': 'Successfully updated'}, 200)
        elif method == 'DELETE':
            collection.document(doc_id).delete()
            return ({'message': 'Successfully deleted'}, 200)
    except Exception as e:
        return ({'error': str(e)}, 500)

# --- CMS ENDPOINTS (FULL CRUD) ---
@app.route('/api/cms/posts', methods=['POST', 'GET'])
def handle_cms_posts():
    if request.method == 'POST':
        return token_required(lambda: generic_crud('cms_posts', method='POST', data=request.get_json()))()
    else: # GET is public
        message, status = generic_crud('cms_posts', method='GET')
    return jsonify(message), status

@app.route('/api/cms/posts/<post_id>', methods=['PUT', 'DELETE', 'GET'])
def handle_cms_post(post_id):
    if request.method == 'GET':
        message, status = generic_crud('cms_posts', doc_id=post_id, method='GET')
    else: # PUT and DELETE require token
        return token_required(lambda: generic_crud('cms_posts', doc_id=post_id, method=request.method, data=request.get_json() if request.method == 'PUT' else None))()
    return jsonify(message), status

# --- PROJECT ENDPOINTS (FULL CRUD) ---
@app.route('/api/projects', methods=['POST', 'GET'])
def handle_projects():
    if request.method == 'POST':
        # Apply decorator logic manually for POST
        return token_required(lambda: generic_crud('projects', method='POST', data=request.get_json()))()
    else: # GET is public
        message, status = generic_crud('projects', method='GET')
    return jsonify(message), status

@app.route('/api/projects/<project_id>', methods=['PUT', 'DELETE', 'GET'])
@token_required
def handle_project(project_id):
    if request.method == 'GET':
        message, status = generic_crud('projects', doc_id=project_id, method='GET')
    else:
        return token_required(lambda: generic_crud('projects', doc_id=project_id, method=request.method, data=request.get_json() if request.method == 'PUT' else None))()
    return jsonify(message), status

# --- CRM ENDPOINTS (FULL CRUD) ---
@app.route('/api/crm', methods=['POST', 'GET'])
@token_required
def handle_crm_contacts():
    if request.method == 'POST':
        message, status = generic_crud('crm', method='POST', data=request.get_json())
    else:
        message, status = generic_crud('crm', method='GET')
    return jsonify(message), status

@app.route('/api/crm/<contact_id>', methods=['PUT', 'DELETE', 'GET'])
@token_required
def handle_crm_contact(contact_id):
    if request.method == 'GET':
        message, status = generic_crud('crm', doc_id=contact_id, method='GET')
    else:
        message, status = generic_crud('crm', doc_id=contact_id, method=request.method, data=request.get_json() if request.method == 'PUT' else None)
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

@app.route('/api/tasks/<task_id>', methods=['PUT', 'DELETE', 'GET'])
@token_required
def handle_task(task_id):
    if request.method == 'GET':
        message, status = generic_crud('tasks', doc_id=task_id, method='GET')
    else:
        message, status = generic_crud('tasks', doc_id=task_id, method=request.method, data=request.get_json() if request.method == 'PUT' else None)
    return jsonify(message), status

# --- SEO Analyzer Endpoint ---
@app.route('/api/analyze-seo', methods=['GET'])
def analyze_seo():
    url_to_analyze = request.args.get('url')
    if not url_to_analyze:
        return jsonify({'error': 'URL parameter is required'}), 400
    
    analysis_results = analyze_on_page_seo(url_to_analyze)
    return jsonify(analysis_results)

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", 8080))