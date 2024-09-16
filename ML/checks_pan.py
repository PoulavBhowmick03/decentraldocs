import pandas as pd
import re
from datetime import datetime

# Load the PAN data
df = pd.read_csv('pan_data.csv')
df_pan = pd.DataFrame()
# Feature extraction functions
def name_length(name):
    return len(name) if pd.notna(name) else 0

def name_type(name):
    return 'Valid' if pd.notna(name) and len(name.strip()) > 0 else 'Invalid'

def father_name_length(father_name):
    return len(father_name) if pd.notna(father_name) else 0

def father_name_type(father_name):
    return 'Valid' if pd.notna(father_name) and len(father_name.strip()) > 0 else 'Invalid'

def dob_valid(dob):
    try:
        dob_date = datetime.strptime(dob, '%d/%m/%Y')
        today = datetime.today()
        return 'Valid' if dob_date <= today else 'Invalid'
    except ValueError:
        return 'Invalid'

def pan_number_length(pan_number):
    return len(pan_number) if pd.notna(pan_number) else 0

def pan_number_type(pan_number):
    return 'Valid' if re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]$', pan_number) else 'Invalid'

def pan_valid(pan_number):
    return 'Valid' if pan_number_length(pan_number) == 10 and pan_number_type(pan_number) == 'Valid' else 'Invalid'

# Apply feature extraction
df_pan['name_length'] = df['name'].apply(name_length)
df_pan['name_type'] = df['name'].apply(name_type)
df_pan['father_name_length'] = df['father_name'].apply(father_name_length)
df_pan['father_name_type'] = df['father_name'].apply(father_name_type)
df_pan['dob_valid'] = df['dob'].apply(dob_valid)
df_pan['pan_number_length'] = df['pan_number'].apply(pan_number_length)
df_pan['pan_number_type'] = df['pan_number'].apply(pan_number_type)
df_pan['pan_valid'] = df['pan_number'].apply(pan_valid)

# Save the results to a new CSV file
df_pan.to_csv('pan_feature_extracted.csv', index=False)

print("Feature extraction completed and saved to pan_feature_extracted.csv")
