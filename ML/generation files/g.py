import random
import string
import pandas as pd
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Function to generate random Aadhaar number (12-digit)
def generate_aadhaar_number():
    return ''.join([str(random.randint(0, 9)) for _ in range(12)])

# Function to generate random mobile number (10-digit)
def generate_mobile_number():
    return ''.join([str(random.randint(0, 9)) for _ in range(10)])

# Generate synthetic data for 50 Aadhaar cards
data = []
for _ in range(100):
    name = fake.name()
    aadhaar_number = generate_aadhaar_number()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%d/%m/%Y")
    address = fake.address().replace("\n", ", ")
    gender = random.choice(['Male', 'Female', 'Other'])
    mobile_number = generate_mobile_number()
    email = fake.email()

    data.append({
        'Name': name,
        'Aadhaar Number': aadhaar_number,
        'Date of Birth': dob,
        'Address': address,
        'Gender': gender,
        'Mobile Number': mobile_number,
        'Email': email
    })

# Convert to a pandas DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('synthetic_aadhaar_data.csv', index=False)

print(df.head())
