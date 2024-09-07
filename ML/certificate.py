from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import requests

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Get wallet addresses from form data
        user_wallet_address = request.form.get('user_wallet_address')
        verifier_wallet_address = request.form.get('verifier_wallet_address')
        issuer_wallet_address = request.form.get('issuer_wallet_address')
        
        # Here you would typically interact with your blockchain or other services
        # For this example, we'll just print the information
        print(f"File saved: {file_path}")
        print(f"User Wallet: {user_wallet_address}")
        print(f"Verifier Wallet: {verifier_wallet_address}")
        print(f"Issuer Wallet: {issuer_wallet_address}")
        
        # Optionally, upload to Pinata (uncomment if you want to use this)
        
        pinata_api_key = "c30436a8c6be466658ea"
        pinata_secret_api_key = "a62b5d89a6fb5737d4af3fd61b363a2871325fdfe5dad92b66d11bb1e95dd175"
        
        url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
        
        payload = {'pinataOptions': '{"cidVersion": 1}'}
        files = [('file', (filename, open(file_path, 'rb'), 'application/octet-stream'))]
        headers = {
            'pinata_api_key': pinata_api_key,
            'pinata_secret_api_key': pinata_secret_api_key
        }
        
    response = requests.post(url, headers=headers, data=payload, files=files)
    ipfs_hash = response.json()['IpfsHash']
    print(f"IPFS Hash: {ipfs_hash}")
        
        
    return jsonify({
        "success": True, 
        "message": "File uploaded successfully",
        "ipfsHash": ipfs_hash
    }), 200
    return jsonify({"success": False, "message": "File type not allowed"}), 400

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=5000)