import cv2
import pytesseract
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

logging.basicConfig(level=logging.DEBUG)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/abc', methods=['POST', 'OPTIONS'])
def process_image():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        app.logger.info("Received request")
        if 'image' not in request.files:
            app.logger.error("No image file in request")
            return jsonify({"error": "No image file provided"}), 400

        image_file = request.files['image']
        app.logger.info(f"Received file: {image_file.filename}")
        
        image_path = "temp_image.png"
        image_file.save(image_path)

        preprocessed_image = preprocess_image(image_path)
        extracted_text = extract_text(preprocessed_image)
        parsed_data = parse_text(extracted_text)

        with open('output.json', 'w') as json_file:
            json.dump(parsed_data, json_file, indent=4)

        return jsonify(parsed_data)

    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

def extract_text(image):
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(image, config=custom_config)
    return text

def parse_text(text):
    lines = text.split('\n')
    data = {
        "certificate_type": lines[0] if len(lines) > 0 else "",
        "name": lines[1] if len(lines) > 1 else "",
        "description": ' '.join(lines[2:]) if len(lines) > 2 else ""
    }
    return data

@app.route('/abc', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    image_path = "temp_image.png"
    image_file.save(image_path)

    preprocessed_image = preprocess_image(image_path)
    extracted_text = extract_text(preprocessed_image)
    parsed_data = parse_text(extracted_text)

    with open('output.json', 'w') as json_file:
        json.dump(parsed_data, json_file, indent=4)

    return jsonify(parsed_data)

if __name__ == '__main__':
    app.run(debug=True)