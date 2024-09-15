import random
import string
import pandas as pd
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Function to generate random voter ID number (e.g., "ABC1234567")
def generate_voter_id():
    return ''.join(random.choices(string.ascii_uppercase, k=3)) + \
           ''.join(random.choices(string.digits, k=7))

# Function to generate random mobile number (10-digit)
def generate_mobile_number():
    return ''.join([str(random.randint(0, 9)) for _ in range(10)])

# Generate synthetic data for 50 voter IDs
voter_id_data = []
for _ in range(100):
    name = fake.name()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%d/%m/%Y")
    fathers_name = fake.name_male()
    address = fake.address().replace("\n", ", ")
    gender = random.choice(['Male', 'Female', 'Other'])
    mobile_number = generate_mobile_number()
    email = fake.email()

    voter_id_number = generate_voter_id()

    voter_id_data.append({
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
df_voter = pd.DataFrame(voter_id_data)
df_voter.to_csv('synthetic_voter_id_data.csv', index=False)

print(df_voter.head())
