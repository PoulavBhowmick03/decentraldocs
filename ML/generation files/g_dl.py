import random
import string
import pandas as pd
from faker import Faker
from datetime import timedelta

# Initialize Faker instance
fake = Faker()

# Function to generate random license number (e.g., "MH12 2015000001")
def generate_license_number():
    state_code = ''.join(random.choices(string.ascii_uppercase, k=2))
    district_code = ''.join(random.choices(string.digits, k=2))
    year_code = ''.join(random.choices(string.digits, k=4))
    serial_code = ''.join(random.choices(string.digits, k=7))
    return f"{state_code}{district_code} {year_code}{serial_code}"

# Function to generate random mobile number (10-digit)
def generate_mobile_number():
    return ''.join([str(random.randint(0, 9)) for _ in range(10)])

# Generate synthetic data for 50 driving licenses
driving_license_data = []
for _ in range(100):
    name = fake.name()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%d/%m/%Y")
    address = fake.address().replace("\n", ", ")
    gender = random.choice(['Male', 'Female', 'Other'])
    mobile_number = generate_mobile_number()
    email = fake.email()

    license_number = generate_license_number()
    issue_date = fake.date_between(start_date='-10y', end_date='today').strftime("%d/%m/%Y")
    expiry_date = (fake.date_between(start_date='today', end_date='+10y') + timedelta(days=3650)).strftime("%d/%m/%Y")

    driving_license_data.append({
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
df_dl = pd.DataFrame(driving_license_data)
df_dl.to_csv('synthetic_driving_license_data.csv', index=False)

print(df_dl.head())
