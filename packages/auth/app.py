import os
import jwt
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({"status": "ok", "message": "Studio37 Auth API is running."})

@app.route('/login', methods=['POST'])
def login():
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({"message": "Username and password are required"}), 400

    # IMPORTANT: Replace this with a real database check
    if auth.get('username') == 'admin' and auth.get('password') == 'password123':
        secret_key = os.getenv('JWT_SECRET')
        if not secret_key:
            return jsonify({"message": "Server configuration error"}), 500

        # Use utcnow() for JWT 'exp' claim and ensure correct type for PyJWT >=2.x
        exp_time = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        payload = {
            'user': auth.get('username'),
            'exp': exp_time
        }
        token = jwt.encode(payload, secret_key, algorithm="HS256")
        # PyJWT >=2.x returns a str, but older versions return bytes
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        return jsonify({'token': token})

    return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)