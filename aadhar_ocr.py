import cv2
import pytesseract
import re
import os
from flask import Flask, request, jsonify

# Define Flask app
app = Flask(__name__)

class Aadhar_OCR:
    def __init__(self, img_path):
        self.user_aadhar_no = str()
        self.user_gender = str()
        self.user_dob = str()
        self.user_name = str()
        self.img_name = img_path
    
    def extract_data(self):
        try:
            # Reading the image
            img = cv2.imread(self.img_name)
            
            if img is None:
                raise ValueError("Image could not be read. Please check the file path and integrity.")

            # Extracting text from the image
            text = pytesseract.image_to_string(img)
            all_text_list = re.split(r'[\n]', text)
            
            # Process the text list to remove all whitespace elements
            text_list = [i for i in all_text_list if not re.match(r'^(\s)+$', i) and i != '']

            # Extracting Aadhar Card No.
            aadhar_no_pat = r'^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$'
            self.user_aadhar_no = next((i for i in text_list if re.match(aadhar_no_pat, i)), '')

            # Extracting Gender
            self.user_gender = 'MALE' if any(re.search(r'(Male|male|MALE)$', i) for i in text_list) else 'FEMALE' if any(re.search(r'(Female|female|FEMALE)$', i) for i in text_list) else ''

            # Extracting DOB
            aadhar_dob_pat = r'(Year|Birth|irth|YoB|YOB:|DOB:|DOB)'
            dob_info = next((i for i in text_list if re.search(aadhar_dob_pat, i)), '')
            if dob_info:
                index = re.search(aadhar_dob_pat, dob_info).span()[1]
                self.user_dob = ''.join(i for i in dob_info[index:] if re.match(r'\d', i) or i == '/')

            # Extracting Name
            dob_idx = next((idx for idx, i in enumerate(text_list) if re.search(aadhar_dob_pat, i)), -1)
            if dob_idx != -1 and dob_idx > 0:
                self.user_name = text_list[dob_idx - 1]

            # Returning extracted data as a dictionary
            return {
                "Aadhar_No": self.user_aadhar_no,
                "Gender": self.user_gender,
                "DOB": self.user_dob,
                "Name": self.user_name
            }
        
        except Exception as e:
            return {"error": str(e)}

# Define a route for the API
@app.route('/aadhar', methods=['POST'])
def extract_aadhar():
    try:
        # Get the uploaded image file from the request
        if 'image' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save the file temporarily
        img_path = os.path.join(os.getcwd(), file.filename)
        file.save(img_path)

        # Initialize the OCR class and extract data
        aadhar_ocr = Aadhar_OCR(img_path)
        extracted_data = aadhar_ocr.extract_data()

        # Remove the image file after processing
        if os.path.exists(img_path):
            os.remove(img_path)

        return jsonify(extracted_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
