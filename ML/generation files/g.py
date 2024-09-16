import random
import pandas as pd
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Function to generate valid Aadhaar numbers (masked format XXXX XXXX dddd)
def generate_masked_aadhaar_number():
    last_four_digits = ''.join([str(random.randint(0, 9)) for _ in range(4)])
    return f'XXXX XXXX {last_four_digits}'

# Function to generate valid PAN numbers (5 letters, 4 digits, 1 letter)
def generate_valid_pan_number():
    return ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=5)) + \
           ''.join(random.choices('0123456789', k=4)) + \
           random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

# Generate valid Aadhaar data
valid_aadhaar_data = []
for _ in range(10000):
    name = fake.name()
    aadhaar_number = generate_masked_aadhaar_number()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%d/%m/%Y")
    address = fake.address().replace("\n", ", ")  # Valid address
    gender = random.choice(['Male', 'Female', 'Other'])  # Valid gender options

    valid_aadhaar_data.append({
        "name": name,
        "dob": dob,
        "gender": gender,
        "aadhaar_number": aadhaar_number,
        "address": address
    })

# Convert Aadhaar data to DataFrame and save as CSV
df_valid_aadhaar = pd.DataFrame(valid_aadhaar_data)
df_valid_aadhaar.to_csv('valid_aadhaar_data.csv', index=False)

print(df_valid_aadhaar)

# Generate valid PAN data
valid_pan_data = []
for _ in range(10000):
    name = fake.name()
    pan_number = generate_valid_pan_number()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%d/%m/%Y")
    father_name = fake.name_male()  # Assuming a valid father's name is always provided

    valid_pan_data.append({
        "name": name,
        "father_name": father_name,
        "dob": dob,
        "pan_number": pan_number
    })

# Convert PAN data to DataFrame and save as CSV
df_valid_pan = pd.DataFrame(valid_pan_data)
df_valid_pan.to_csv('valid_pan_data.csv', index=False)

print(df_valid_pan)
