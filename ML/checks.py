import pandas as pd
import numpy as np
from datetime import datetime
import re
import json

#df = pd.read_csv('aadhaar_data.csv')

# Load the dataset from JSON file
with open('./../../aadhaar_info.json', 'r') as f:
    file = json.load(f)
    df = pd.DataFrame(file)
    df.drop(columns=['address_entities'], inplace=True)  # Dropping unnecessary columns
    df.drop(index=[1, 2, 3, 4], inplace=True)  # Dropping rows 1 to 4
    print(df.head())

# Function to extract features from Aadhaar data
def extract_features(df):
    # Check if DOB is valid (not a future date and not older than 100 years)
    def is_valid_date(date_str):
        # Remove any extra quotes if present
        date_str = date_str.strip('"')

        # List of acceptable date formats
        date_formats = ["%d/%m/%Y", "%d-%m-%Y"]

        for date_format in date_formats:
            try:
                date = datetime.strptime(date_str, date_format)
                today = datetime.today()
                return not (date > today or date < (today - pd.DateOffset(years=100)))
            except ValueError:
                continue
            
        return False


    # Check if Aadhaar is masked (format: XXXX XXXX d{4})
    def is_masked_aadhaar(aadhaar_str):
        return bool(re.match(r'^XXXX XXXX \d{4}$', aadhaar_str))

    # Determine the name type based on the number of words
    def get_name_type(name):
        return 'full_name' if len(name.split()) > 1 else 'single_name'

    # Classify the address type
    def get_address_type(address):
        if pd.isna(address) or address == '':
            return 'missing'
        elif len(address.split()) > 3:
            return 'detailed'
        else:
            return 'short'

    # Process each row and extract features
    def process_row(row):
        # Name Length
        name_length = len(row['name']) if pd.notna(row['name']) else np.nan
        
        # Name Type
        name_type = get_name_type(row['name']) if pd.notna(row['name']) else 'missing'
        
        # Date of Birth Validity
        dob_valid = is_valid_date(row['dob']) if pd.notna(row['dob']) else False
        
        # Gender (unchanged)
        gender = row['gender'] if pd.notna(row['gender']) else 'unknown'
        
        # Masked Aadhaar
        masked_aadhaar = is_masked_aadhaar(row['aadhaar_number']) if pd.notna(row['aadhaar_number']) else False
        
        # Aadhaar Number Length (including spaces)
        aadhaar_number_length = len(row['aadhaar_number']) if pd.notna(row['aadhaar_number']) else np.nan
        
        # Address Length
        address_length = len(row['address']) if pd.notna(row['address']) else np.nan
        
        # Address Type
        address_type = get_address_type(row['address']) if pd.notna(row['address']) else 'missing'
        
        # Aadhaar Validity (length of 14 including spaces and masked)
        aadhaar_valid = aadhaar_number_length == 14 and masked_aadhaar
        
        return pd.Series([
            name_length, name_type, dob_valid, gender, masked_aadhaar,
            aadhaar_number_length, address_length,
            address_type, aadhaar_valid
        ], index=['name_length', 'name_type', 'dob_valid', 'gender', 'masked_aadhaar',
                  'aadhaar_number_length', 'address_length',
                  'address_type', 'aadhaar_valid'])

    features_df = df.apply(process_row, axis=1)
    return features_df

# Extract features and save to a new CSV
features_df = extract_features(df)
features_df.to_csv('test.csv', index=False)
print("Feature extraction completed and saved to 'test.csv'")
