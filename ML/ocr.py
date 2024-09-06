import cv2
import numpy as np
import pytesseract

from PIL import Image
import os 
import json
import re
from keras.models import load_model

class_labels = ["Aadhaar", "PAN", "Driving Licence", "Voter ID", "Passport", "Utility"]

files = ["driving_license_info.json", "passport_info.json", "pan_card_info.json", "voter_id_info.json"]
for file in files:
    file = open(file, "w")
    file.close()

def grayscale(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def noise_removal(image):
    import numpy as np
    kernel = np.ones((1, 1), np.uint8)
    image = cv2.dilate(image, kernel, iterations=1)
    kernel = np.ones((1, 1), np.uint8)
    image = cv2.erode(image, kernel, iterations=1)
    image = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
    image = cv2.medianBlur(image, 3)
    return (image)

def thin_font(image):
    import numpy as np
    image = cv2.bitwise_not(image)
    kernel = np.ones((2,2),np.uint8)
    image = cv2.erode(image, kernel, iterations=1)
    image = cv2.bitwise_not(image)
    return (image)

def thick_font(image):
    import numpy as np
    image = cv2.bitwise_not(image)
    kernel = np.ones((2,2),np.uint8)
    image = cv2.dilate(image, kernel, iterations=1)
    image = cv2.bitwise_not(image)
    return (image)

def getSkewAngle(cvImage) -> float:
    # Prep image, copy, convert to gray scale, blur, and threshold
    newImage = cvImage.copy()
    gray = cv2.cvtColor(newImage, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (9, 9), 0)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # Apply dilate to merge text into meaningful lines/paragraphs.
    # Use larger kernel on X axis to merge characters into single line, cancelling out any spaces.
    # But use smaller kernel on Y axis to separate between different blocks of text
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 5))
    dilate = cv2.dilate(thresh, kernel, iterations=2)

    # Find all contours
    contours, hierarchy = cv2.findContours(dilate, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key = cv2.contourArea, reverse = True)
    for c in contours:
        rect = cv2.boundingRect(c)
        x,y,w,h = rect
        cv2.rectangle(newImage,(x,y),(x+w,y+h),(0,255,0),2)

    # Find largest contour and surround in min area box
    largestContour = contours[0]
    print (len(contours))
    minAreaRect = cv2.minAreaRect(largestContour)
    cv2.imwrite("temp/boxes.jpg", newImage)
    # Determine the angle. Convert it to the value that was originally used to obtain skewed image
    angle = minAreaRect[-1]
    if angle < -45:
        angle = 90 + angle
    return -1.0 * angle
# Rotate the image around its center
def rotateImage(cvImage, angle: float):
    newImage = cvImage.copy()
    (h, w) = newImage.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    newImage = cv2.warpAffine(newImage, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return newImage

def deskew(cvImage):
    angle = getSkewAngle(cvImage)
    return rotateImage(cvImage, -1.0 * angle)

def remove_borders(img):
    contours,hierarchy = cv2.findContours(img,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    cntsSorted = sorted(contours, key=lambda x: cv2.contourArea(x))
    cnt = cntsSorted[-1]
    print (len(contours))
    x,y,w,h = cv2.boundingRect(cnt)
    crop = img[y:y+h,x:x+w]
    return (crop)

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)  # Add an extra dimension for batch size
    return img

image_file = "./archive/Driving_Licence/10.jpg"
img = cv2.imread(image_file)
cv2.imwrite("temp_begin.jpg", img)
# Preprocess the input image
input_image = preprocess_image(image_file)

# Make predictions on the input image
predictions = model.predict(input_image)
predicted_class_index = np.argmax(predictions)
predicted_class = class_labels[predicted_class_index]


#fixed_img = deskew(img)
#cv2.imwrite("temp_skew.jpg", fixed_img)

if predicted_class == "Driving Licence":
    
    gray_image = grayscale(img)
    cv2.imwrite("temp_gray.jpg", gray_image)

    ocr_result = pytesseract.image_to_string(gray_image)
    print(ocr_result)

    def extract_information(text):
        license_info = {}

        # Extract License Number (assumes pattern like XX00/000000/00)
        license_number = re.search(r'\b[A-Z]{2}\d{2}/\d{6}/\d{2}\b', text)
        if license_number:
            license_info['License Number'] = license_number.group()

        # Extract any dates in the format dd/mm/yyyy or dd/mm/yy
        dates = re.findall(r'\b\d{2}/\d{2}/\d{2,4}\b', text)
        if dates:
            license_info['Dates'] = dates

        # Extract Name (Assumes it's all-uppercase or follows the word "Name")
        name = re.search(r'(Name|NAME)\s*([A-Z]+\s[A-Z]+)', text)
        if name:
            license_info['Name'] = name.group(2)

        # Extract Address (Assumes it follows the word "Address" and spans multiple lines)
        address = re.search(r'(Address|ADDRESS)\s*(.+)', text, re.DOTALL)
        if address:
            # Clean up the address by replacing newlines with commas
            clean_address = address.group(2).replace('\n', ', ').strip()
            license_info['Address'] = clean_address

        # Extract Date of Birth (DOB) assuming "DB" or "D.O.B." precedes it
        dob = re.search(r'(DB|D.O.B.)\s*(\d{2}/\d{2}/\d{2,4})', text)
        if dob:
            license_info['Date of Birth'] = dob.group(2)

        # Extract License Validity (Assumes the last date is the validity date)
        if dates:
            license_info['License Validity'] = dates[-1]

        # Return extracted information
        return license_info

    # Call the function with the driving license text
    #text = '''Driving Licence\n\nNumber issued on\nGJ12/001870/00 28/03/2000\nName DARJI SURESH\nKHETSH!\nAddress NR, MADR, ANZIL\nCAMP Jr i4GAR\nBHU, -: 6004\n\nDB 15/09/42:\nis licenced to driver\n\nValid for other than Transport Vehicles\n'''
    license_info = extract_information(ocr_result)

    # Save to JSON
    with open("driving_license_info.json", "a") as json_file:
        json.dump(license_info, json_file, indent=4)

    # Print the information for reference
    print(json.dumps(license_info, indent=4))

elif predicted_class == "Passport":
    gray_image = grayscale(img)
    cv2.imwrite("temp_gray.jpg", gray_image)

    thresh, im_bw = cv2.threshold(gray_image, 140, 230, cv2.THRESH_BINARY)
    cv2.imwrite("temp_bw.jpg", im_bw)

    ocr_result = pytesseract.image_to_string(im_bw)
    print(ocr_result)

    def extract_passport_info(text):
        info = {}

        # Extract name (non-MRZ format)
        name_match = re.search(r"([A-Z]+\s[A-Z]+)", text)
        if name_match:
            info['Name'] = name_match.group(0).title()

        # Extract date of birth
        dob_match = re.search(r'(\d{2}/\d{2}/\d{4})\sF', text)
        if dob_match:
            info['Date of Birth'] = dob_match.group(1)

        # Extract place of birth (B followed by the location)
        pob_match = re.search(r'B\s([A-Z,\s]+)', text)
        if pob_match:
            info['Place of Birth'] = pob_match.group(1).strip()

        # Extract date of issue
        doi_match = re.search(r'\+\s(\d{2}/\d{2}/\d{4})', text)
        if doi_match:
            info['Date of Issue'] = doi_match.group(1)

        # Extract passport number from MRZ
        passport_no_match = re.search(r'P<IND<<[A-Z<]+\n([A-Z0-9]{9})', text)
        if passport_no_match:
            info['Passport Number'] = passport_no_match.group(1)

        # Extract gender from MRZ
        gender_match = re.search(r'<([A-Z])', text)
        if gender_match:
            info['Gender'] = 'Female' if gender_match.group(1) == 'F' else 'Male'

        return info

    # Extracting passport information
    passport_info = extract_passport_info(ocr_result)

    # Saving to JSON file
    with open("passport_info.json", "a") as json_file:
        json.dump(passport_info, json_file, indent=4)

elif predicted_class == "PAN":
    gray_image = grayscale(img)
    cv2.imwrite("temp_gray.jpg", gray_image)

    thresh, im_bw = cv2.threshold(gray_image, 120, 250, cv2.THRESH_BINARY)
    cv2.imwrite("temp_bw.jpg", im_bw)

    no_noise = noise_removal(im_bw)
    cv2.imwrite("temp_no_noise.jpg", no_noise)

    eroded_image = thin_font(no_noise)
    dilated_image = thick_font(no_noise)

    ocr_result = pytesseract.image_to_string(no_noise)
    print(ocr_result)

    def extract_pan_card_info(text):
        info = {}

        # Extract Name (Assumes Name is before PAN Number and Date of Birth)
        name_match = re.search(r'\b([A-Z\s]+)\n([A-Z\s]+)\n', text)
        if name_match:
            info["Name"] = f"{name_match.group(1).strip()} {name_match.group(2).strip()}"
        else:
            info["Name"] = "Not found"

        # Extract Date of Birth (Assumes a date format dd/mm/yyyy)
        dob_match = re.search(r'\b\d{2}/\d{2}/\d{4}\b', text)
        info["Date of Birth"] = dob_match.group() if dob_match else "Not found"

        # Extract PAN Number (Assumes PAN Number is in the format XXXXX9999X)
        pan_match = re.search(r'Permanent\s+Account\s+Number\s+([A-Z]{5}\d{4}[A-Z])', text)
        info["PAN Number"] = pan_match.group(1) if pan_match else "Not found"

        return info

    # Extract PAN Card information
    pan_card_info = extract_pan_card_info(ocr_result)

    # Save to JSON file
    with open('pan_card_info.json', 'a') as json_file:
        json.dump(pan_card_info, json_file, indent=4)

    # Print the extracted information
    print("PAN Card Info:", pan_card_info)

elif predicted_class == "Voter ID":
    gray_image = grayscale(img)
    cv2.imwrite("temp_gray.jpg", gray_image)

    thresh, im_bw = cv2.threshold(gray_image, 80, 300, cv2.THRESH_BINARY)
    cv2.imwrite("temp_bw.jpg", im_bw)

    no_noise = noise_removal(im_bw)
    cv2.imwrite("temp_no_noise.jpg", no_noise)

    eroded_image = thin_font(no_noise)
    dilated_image = thick_font(no_noise)

    no_borders = remove_borders(no_noise)
    cv2.imwrite("temp_no_borders.jpg", no_borders)
    color = [255, 255, 255] # 'cause purple!

    # border widths; I set them all to 150
    top, bottom, left, right = [150]*4

    img_with_border = cv2.copyMakeBorder(no_borders, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    cv2.imwrite("temp_final.jpg", no_borders)

    ocr_result = pytesseract.image_to_string(no_borders)
    print(ocr_result)

    def extract_voter_info(text):
        voter_info = {}

        # Extract Voter ID Number (Alphanumeric pattern and ignore partial OCR errors)
        voter_id = re.search(r'\b[A-Z0-9]{10,}\b', text)
        if voter_id:
            voter_info['Voter ID Number'] = voter_id.group()
        else:
            voter_info['Voter ID Number'] = "Not found"

        # Extract Name (Try to capture lines after "Name")
        name_match = re.search(r'Name\s*[:.]*\s*([A-Z][A-Z\s]+)', text, re.IGNORECASE)
        if name_match:
            voter_info['Name'] = name_match.group(1).strip()
        else:
            voter_info['Name'] = "Not found"

        # Extract Father's Name (Handle OCR errors in spacing)
        father_name_match = re.search(r"Father'?s?\s*[-:—]*\s*(.+?)\s*(Name|$)", text, re.IGNORECASE)
        if father_name_match:
            voter_info["Father's Name"] = father_name_match.group(1).strip()
        else:
            voter_info["Father's Name"] = "Not found"

        return voter_info

    # Extract voter information
    voter_info = extract_voter_info(ocr_result)

    # Save the extracted information to JSON
    with open("voter_id_info.json", "a") as json_file:
        json.dump(voter_info, json_file, indent=4)

    # Print the extracted information
    print(json.dumps(voter_info, indent=4))

elif predicted_class == "Aadhaar":
    print("Binayak")

else:
    print("Unknown document type")
    print("Please try again with a different document")