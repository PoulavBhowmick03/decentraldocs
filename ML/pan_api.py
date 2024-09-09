# Importing Required Packages
import cv2
import pytesseract
import re
from flask import Flask, request, jsonify

app = Flask(__name__)

class PAN_OCR:
    def __init__(self, img_path):
        self.user_pan_no = str()
        self.user_name = str()
        self.user_dob = str()
        self.img_name = img_path

    def grayscale(self, image):
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    def extract_data(self):
        try:
            # Reading the image, converting to grayscale and binary for better OCR results
            img = cv2.imread(self.img_name)
            gray_img = self.grayscale(img)
            img_bw = cv2.threshold(gray_img, 120, 250, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
            text = pytesseract.image_to_string(img_bw)
            all_text_list = re.split(r'[\n]', text)

            # Process the text list to remove all whitespace elements
            text_list = [i.strip() for i in all_text_list if i.strip()]

            # Print the text list for inspection
            print("Extracted Text List:")
            for idx, line in enumerate(text_list):
                print(f"{idx}: {line}")

            # Extracting PAN number
            pan_no_pat = r'[A-Z]{5}[0-9]{4}[A-Z]{1}'
            self.user_pan_no = next((i for i in text_list if re.match(pan_no_pat, i)), '')

            # Extracting Name
            name_idx = next((idx + 1 for idx, text in enumerate(text_list) if re.search(r'(Name|NAME)', text)), -1)
            if name_idx != -1 and name_idx < len(text_list):
                self.user_name = text_list[name_idx]

            # Extracting Date of Birth
            dob_pat = r'\d{2}/\d{2}/\d{4}'
            self.user_dob = next((i for i in text_list if re.search(dob_pat, i)), '')

            print(f"Extracted Data: PAN No: {self.user_pan_no}, Name: {self.user_name}, DOB: {self.user_dob}")
            return {
                "pan_no": self.user_pan_no,
                "name": self.user_name,
                "dob": self.user_dob
            }

        except Exception as e:
            print(f"An error occurred during data extraction: {e}")
            return {}

# Flask API route
@app.route('/pan', methods=['POST'])
def extract_pan():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    image_path = 'uploaded_pan_image.png'
    image_file.save(image_path)

    pan_ocr = PAN_OCR(image_path)
    extracted_data = pan_ocr.extract_data()

    if extracted_data:
        return jsonify(extracted_data), 200
    else:
        return jsonify({"error": "Data extraction failed"}), 500

if __name__ == "__main__":
    app.run(debug=True)
