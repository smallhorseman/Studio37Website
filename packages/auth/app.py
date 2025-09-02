import os
import jwt
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

load_dotenv()
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET')  # Change this!
CORS(app, origins=["https://studio37.cc", "http://localhost:3000"])
jwt = JWTManager(app)

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
        access_token = create_access_token(identity=auth.get('username'))
        return jsonify(access_token=access_token), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)