from flask import Flask, request, jsonify
import cv2
import pytesseract
import spacy
import re
import json
import warnings
import os

warnings.filterwarnings("ignore")

# Initialize Flask app
app = Flask(__name__)

# Load the NLP model
nlp = spacy.load("en_core_web_sm")

@app.route('/aadhaar', methods=['POST'])
def extract_aadhaar_info():
    def extract_info_aadhaar(ocr_text: str):
        # Extract name
        name_match = re.search(r'([A-Z\s]+)\nsl l2/DOB', ocr_text)
        name = name_match.group(1).strip() if name_match else None

        # Extract DOB
        dob_match = re.search(r'DOB:\s*(\d{2}-\d{2}-\d{4})', ocr_text)
        dob = dob_match.group(1) if dob_match else None

        # Extract Gender
        gender_match = re.search(r'¢/\s*(MALE|FEMALE|OTHER)', ocr_text)
        gender = gender_match.group(1) if gender_match else None

        # Extract Aadhaar Number
        aadhaar_match = re.search(r'XXXX XXXX (\d{4})', ocr_text)
        aadhaar_number = f"XXXX XXXX {aadhaar_match.group(1)}" if aadhaar_match else None

        # Extract Address (from 'Address:' to the end of the block)
        address_match = re.search(r'Address:\s*([\s\S]+?)\nXXXX', ocr_text)
        address = address_match.group(1).strip() if address_match else None

        return {
            "name": name,
            "dob": dob,
            "gender": gender,
            "aadhaar_number": aadhaar_number,
            "address": address
        }

    # Check if an image is provided
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    # Save the uploaded file temporarily
    temp_image_path = "./temp_image.jpg"
    file.save(temp_image_path)

    # Read the image using OpenCV
    img = cv2.imread(temp_image_path)

    # Preprocess the image (grayscale + thresholding)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, threshed = cv2.threshold(gray, 120, 255, cv2.THRESH_TRUNC)

    # Perform OCR using pytesseract
    text = pytesseract.image_to_string(threshed, lang="ben+hin+eng")

    # Extract information from the OCR text
    info = extract_info_aadhaar(text)

    # Perform NLP on the address field if extracted
    if info["address"]:
        doc = nlp(info["address"])
        entities = [(ent.text, ent.label_) for ent in doc.ents]
        info["address_entities"] = entities

    # Cleanup the temporary image file
    os.remove(temp_image_path)

    # Return the extracted info as a JSON response
    return jsonify(info), 200

@app.route('/pan', methods=['POST'])
def extract_info_pan():
    def extract_pan_info(ocr_text: str):
        # Extract Name (Typically appears right after "INCOME TAX DEPARTMENT")
        name_match = re.search(r'INCOME TAX DEPARTMENT\s+([A-Z\s]+)\n([A-Z\s]+)', ocr_text)
        if name_match:
            name = name_match.group(1).strip()
            father_name = name_match.group(2).strip()
        else:
            name = None
            father_name = None

        # Extract Date of Birth (DOB)
        dob_match = re.search(r'(\d{2}/\d{2}/\d{4})', ocr_text)
        dob = dob_match.group(0) if dob_match else None

        # Extract PAN Number (Format: 5 letters, 4 digits, and 1 letter)
        pan_match = re.search(r'[A-Z]{5}\d{4}[A-Z]', ocr_text)
        pan_number = pan_match.group(0) if pan_match else None

        return {
            "name": name,
            "father_name": father_name,
            "dob": dob,
            "pan_number": pan_number
        }

    # Check if an image is provided
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    # Save the uploaded file temporarily
    temp_image_path = "./temp_image.jpg"
    file.save(temp_image_path)

    # Read the image using OpenCV
    img = cv2.imread(temp_image_path)

    # Preprocess the image (grayscale + thresholding)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, threshed = cv2.threshold(gray, 120, 255, cv2.THRESH_TRUNC)

    # Perform OCR using pytesseract
    text = pytesseract.image_to_string(threshed, lang="eng+hin")
    
    # Extract information from the OCR text
    info = extract_pan_info(text)

    # Cleanup the temporary image file
    os.remove(temp_image_path)

    # Return the extracted info as a JSON response
    return jsonify(info), 200

if __name__ == '__main__':
    app.run(debug=True)
