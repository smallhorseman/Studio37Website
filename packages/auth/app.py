import os
import jwt
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# --- Initialization ---
load_dotenv()
app = Flask(__name__)
CORS(app)

# --- Health Check Endpoint ---
@app.route('/')
def index():
    """A simple endpoint to check if the auth API is running."""
    return jsonify({"status": "ok", "message": "Studio37 Auth API is running."})

# --- Login Endpoint ---
@app.route('/login', methods=['POST'])
def login():
    """Handles user authentication and issues a JWT."""
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({"message": "Could not verify"}), 401, {'WWW-Authenticate': 'Basic realm="Login required!"'}

    # --- IMPORTANT ---
    # This is a placeholder for checking credentials.
    # In a real application, you would look up the user in a database
    # and compare a hashed version of the password.
    if auth.get('username') == 'admin' and auth.get('password') == 'password123':
        secret_key = os.getenv('JWT_SECRET')
        if not secret_key:
            return jsonify({"message": "Server configuration error: JWT_SECRET not set."}), 500

        try:
            # Create the token with a 24-hour expiration
            token = jwt.encode({
                'user': auth.get('username'),
                'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
            }, secret_key, algorithm="HS256")

            return jsonify({'token': token})
        except Exception as e:
            return jsonify({"message": f"Error generating token: {e}"}), 500

    return jsonify({"message": "Invalid credentials"}), 401, {'WWW-Authenticate': 'Basic realm="Login required!"'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True) # Running on a different port (5002) for local testing