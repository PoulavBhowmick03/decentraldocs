import random
import string
import pandas as pd
from faker import Faker

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

# Function to generate anomalous mobile numbers
def generate_anomalous_mobile_number():
    anomaly_type = random.choice(['short_length', 'long_length', 'non_numeric'])
    if anomaly_type == 'short_length':
        return ''.join([str(random.randint(0, 9)) for _ in range(random.randint(1, 9))])  # Less than 10 digits
    elif anomaly_type == 'long_length':
        return ''.join([str(random.randint(0, 9)) for _ in range(random.randint(11, 15))])  # More than 10 digits
    else:  # non_numeric
        return ''.join(random.choices(string.ascii_letters + string.digits, k=10))  # Contains letters

# Generate anomalous data for 10 Aadhaar cards
anomalous_aadhaar_data = []
for _ in range(10):
    name = fake.name()
    aadhaar_number = generate_anomalous_aadhaar_number()
    dob_anomaly = random.choice(['future_date', 'invalid_format'])
    if dob_anomaly == 'future_date':
        dob = fake.date_between(start_date='+1d', end_date='+30y').strftime("%d/%m/%Y")  # Future date
    else:
        dob = '31-02-2000'  # Invalid date format
    address = '' if random.choice([True, False]) else fake.address().replace("\n", ", ")  # Possibly missing
    gender = 'Unknown' if random.choice([True, False]) else random.choice(['Male', 'Female', 'Other'])
    mobile_number = generate_anomalous_mobile_number()
    email = 'invalid_email' if random.choice([True, False]) else fake.email()

    anomalous_aadhaar_data.append({
        'Name': name,
        'Aadhaar Number': aadhaar_number,
        'Date of Birth': dob,
        'Address': address,
        'Gender': gender,
        'Mobile Number': mobile_number,
        'Email': email
    })

# Convert to a pandas DataFrame and save to CSV
df_aadhaar_anomaly = pd.DataFrame(anomalous_aadhaar_data)
df_aadhaar_anomaly.to_csv('anomalous_aadhaar_data.csv', index=False)

print(df_aadhaar_anomaly)

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

# Generate anomalous data for 10 PAN cards
anomalous_pan_data = []
for _ in range(10):
    name = '' if random.choice([True, False]) else fake.name()  # Possibly missing
    pan_number = generate_anomalous_pan_number()
    dob = '2000/31/12' if random.choice([True, False]) else fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%d/%m/%Y")  # Invalid format
    fathers_name = fake.name_female() if random.choice([True, False]) else fake.name_male()  # Inconsistent father's name
    gender = 'X' if random.choice([True, False]) else random.choice(['Male', 'Female', 'Other'])  # Invalid gender
    mobile_number = generate_anomalous_mobile_number()
    email = fake.free_email() if random.choice([True, False]) else 'email@domain'  # Invalid email

    anomalous_pan_data.append({
        'Name': name,
        'PAN Number': pan_number,
        'Date of Birth': dob,
        'Father\'s Name': fathers_name,
        'Gender': gender,
        'Mobile Number': mobile_number,
        'Email': email
    })

# Convert to a pandas DataFrame and save to CSV
df_pan_anomaly = pd.DataFrame(anomalous_pan_data)
df_pan_anomaly.to_csv('anomalous_pan_data.csv', index=False)

print(df_pan_anomaly)

# Function to generate anomalous driving license numbers
def generate_anomalous_license_number():
    anomaly_type = random.choice(['invalid_format', 'short_length', 'long_length'])
    if anomaly_type == 'invalid_format':
        return ''.join(random.choices(string.digits, k=15))  # All digits, no letters
    elif anomaly_type == 'short_length':
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=random.randint(1, 9)))  # Too short
    else:  # long_length
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=random.randint(21, 30)))  # Too long

# Generate anomalous data for 10 driving licenses
anomalous_driving_license_data = []
for _ in range(10):
    name = fake.name()
    dob = fake.date_of_birth(minimum_age=16, maximum_age=90).strftime("%d/%m/%Y")
    address = fake.address().replace("\n", ", ")
    gender = random.choice(['Male', 'Female', 'Other', 'Unknown'])  # 'Unknown' is invalid
    mobile_number = generate_anomalous_mobile_number()
    email = fake.email()

    license_number = generate_anomalous_license_number()
    issue_date = fake.date_between(start_date='+1d', end_date='+10y').strftime("%d/%m/%Y")  # Issue date in the future
    expiry_date = fake.date_between(start_date='-10y', end_date='today').strftime("%d/%m/%Y")  # Expiry date in the past

    anomalous_driving_license_data.append({
        'Name': name,
        'Driving License Number': license_number,
        'License Issue Date': issue_date,
        'License Expiry Date': expiry_date,
        'Date of Birth': dob,
        'Address': address,
        'Gender': gender,
        'Mobile Number': mobile_number,
        'Email': email
    })

# Convert to a pandas DataFrame and save to CSV
df_dl_anomaly = pd.DataFrame(anomalous_driving_license_data)
df_dl_anomaly.to_csv('anomalous_driving_license_data.csv', index=False)

print(df_dl_anomaly)

# Function to generate anomalous voter ID numbers
def generate_anomalous_voter_id():
    anomaly_type = random.choice(['short_length', 'long_length', 'non_alphanumeric'])
    if anomaly_type == 'short_length':
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=random.randint(1, 7)))  # Less than expected
    elif anomaly_type == 'long_length':
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=random.randint(16, 20)))  # More than expected
    else:  # non_alphanumeric
        return ''.join(random.choices(string.punctuation + string.whitespace, k=10))  # Special characters

# Generate anomalous data for 10 voter IDs
anomalous_voter_id_data = []
for _ in range(10):
    name = fake.name()
    dob = '29/02/2019' if random.choice([True, False]) else fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%d/%m/%Y")  # Invalid date (non-leap year)
    fathers_name = '' if random.choice([True, False]) else fake.name_male()  # Possibly missing
    address = fake.address().replace("\n", ", ")
    gender = random.choice(['M', 'F', 'O'])  # Single-letter gender codes
    mobile_number = generate_anomalous_mobile_number()
    email = fake.email()

    voter_id_number = generate_anomalous_voter_id()

    anomalous_voter_id_data.append({
        'Name': name,
        'Voter ID Number': voter_id_number,
        'Date of Birth': dob,
        'Father\'s Name': fathers_name,
        'Address': address,
        'Gender': gender,
        'Mobile Number': mobile_number,
        'Email': email
    })

# Convert to a pandas DataFrame and save to CSV
df_voter_anomaly = pd.DataFrame(anomalous_voter_id_data)
df_voter_anomaly.to_csv('anomalous_voter_id_data.csv', index=False)

print(df_voter_anomaly)


