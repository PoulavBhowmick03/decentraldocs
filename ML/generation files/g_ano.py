import random
import pandas as pd
from faker import Faker
import string

# Initialize Faker instance
fake = Faker()

# Function to generate anomalous Aadhaar numbers
def generate_anomalous_aadhaar_number():
    anomaly_type = random.choice(['short_length', 'long_length', 'non_numeric'])
    if anomaly_type == 'short_length':
        return ''.join([str(random.randint(0, 9)) for _ in range(random.randint(1, 11))])  # Less than 12 digits
    elif anomaly_type == 'long_length':
        return ''.join([str(random.randint(0, 9)) for _ in range(random.randint(13, 20))])  # More than 12 digits
    else:  # non_numeric
        return ''.join(random.choices(string.ascii_letters + string.digits, k=12))  # Contains letters

# Function to generate anomalous PAN numbers
def generate_anomalous_pan_number():
    anomaly_type = random.choice(['short_length', 'long_length', 'invalid_format', 'lowercase_letters'])
    if anomaly_type == 'short_length':
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=random.randint(1, 9)))  # Less than 10 chars
    elif anomaly_type == 'long_length':
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=random.randint(11, 15)))  # More than 10 chars
    elif anomaly_type == 'invalid_format':
        return ''.join(random.choices(string.digits + string.ascii_uppercase, k=10))  # Incorrect format
    else:  # lowercase_letters
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))  # Contains lowercase letters

# Generate anomalous Aadhaar data
anomalous_aadhaar_data = []
for _ in range(50):
    name = fake.name()
    aadhaar_number = generate_anomalous_aadhaar_number()  # Anomalous Aadhaar number
    dob_anomaly = random.choice(['future_date', 'invalid_format'])
    if dob_anomaly == 'future_date':
        dob = fake.date_between(start_date='+1d', end_date='+30y').strftime("%d/%m/%Y")  # Future date
    else:
        dob = '31-02-2000'  # Invalid date format
    address = '' if random.choice([True, False]) else fake.address().replace("\n", ", ")  # Possibly missing
    gender = 'Unknown' if random.choice([True, False]) else random.choice(['Male', 'Female', 'Other'])
    
    anomalous_aadhaar_data.append({
        "name": name,
        "dob": dob,
        "gender": gender,
        "aadhaar_number": aadhaar_number,
        "address": address
    })

# Convert Aadhaar data to DataFrame and save as CSV
df_anomalous_aadhaar = pd.DataFrame(anomalous_aadhaar_data)
df_anomalous_aadhaar.to_csv('anomalous_aadhaar_data.csv', index=False)

print(df_anomalous_aadhaar)

# Generate anomalous PAN data
anomalous_pan_data = []
for _ in range(50):
    name = fake.name()  # Valid name
    pan_number = generate_anomalous_pan_number()  # Anomalous PAN number
    dob = '2000/31/12' if random.choice([True, False]) else fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%d/%m/%Y")  # Invalid date format
    father_name = fake.name_female() if random.choice([True, False]) else fake.name_male()  # Anomalous father's name

    anomalous_pan_data.append({
        "name": name,
        "father_name": father_name,
        "dob": dob,
        "pan_number": pan_number
    })

# Convert PAN data to DataFrame and save as CSV
df_anomalous_pan = pd.DataFrame(anomalous_pan_data)
df_anomalous_pan.to_csv('anomalous_pan_data.csv', index=False)

print(df_anomalous_pan)
