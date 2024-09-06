import cv2
import pytesseract
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

def preprocess_image(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
    gray = cv2.convertScaleAbs(gray, alpha=1.5, beta=0)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    return gray

def extract_text(image):
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(image, config=custom_config)
    return text

def parse_text(text):
    # This is a basic parser. You may need to adjust it based on your specific certificate format
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