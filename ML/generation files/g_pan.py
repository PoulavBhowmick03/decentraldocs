import random
import string
import pandas as pd
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Function to generate random PAN number
def generate_pan_number():
    return ''.join(random.choices(string.ascii_uppercase, k=5)) + \
           ''.join(random.choices(string.digits, k=4)) + \
           random.choice(string.ascii_uppercase)

# Function to generate random mobile number (10-digit)
def generate_mobile_number():
    return ''.join([str(random.randint(0, 9)) for _ in range(10)])

# Generate synthetic data for 50 PAN cards
data = []
for _ in range(100):
    name = fake.name()
    pan_number = generate_pan_number()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%d/%m/%Y")
    fathers_name = fake.name_male()
    gender = random.choice(['Male', 'Female', 'Other'])
    mobile_number = generate_mobile_number()
    email = fake.email()

    data.append({
        'Name': name,
        'PAN Number': pan_number,
        'Date of Birth': dob,
        'Father\'s Name': fathers_name,
        'Gender': gender,
        'Mobile Number': mobile_number,
        'Email': email
    })

# Convert to a pandas DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('synthetic_pan_data.csv', index=False)

print(df.head())
