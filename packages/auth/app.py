import os
import jwt
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

# This health check endpoint is missing from your currently deployed code
@app.route('/')
def index():
    """A simple endpoint to check if the auth API is running."""
    return jsonify({"status": "ok", "message": "Studio37 Auth API is running."})

@app.route('/login', methods=['POST'])
def login():
    """Handles user authentication and issues a JWT."""
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({"message": "Username and password are required"}), 400

    # IMPORTANT: Replace this with a real database check
    if auth.get('username') == 'admin' and auth.get('password') == 'password123':
        secret_key = os.getenv('JWT_SECRET')
        if not secret_key:
            return jsonify({"message": "Server configuration error"}), 500
        
        token = jwt.encode({
            'user': auth.get('username'),
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
        }, secret_key, algorithm="HS256")
        
        return jsonify({'token': token})

    return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)