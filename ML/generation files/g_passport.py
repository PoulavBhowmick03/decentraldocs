from faker import Faker
import random
import pandas as pd

# Initialize Faker
fake = Faker()

# Function to generate a fake passport entry
def generate_passport_data():
    return {
        'passport_number': fake.unique.bothify(text='???######'),  # Random passport number
        'name': fake.name(),
        'nationality': fake.country(),
        'date_of_birth': fake.date_of_birth(minimum_age=18, maximum_age=80).strftime('%Y-%m-%d'),
        'issue_date': fake.date_this_decade().strftime('%Y-%m-%d'),
        'expiry_date': fake.date_between(start_date='today', end_date='+10y').strftime('%Y-%m-%d'),
        'passport_type': random.choice(['Regular', 'Official', 'Diplomatic'])
    }

# Function to introduce anomalies in the data
def introduce_anomaly(passport_data):
    anomaly_type = random.choice(['invalid_passport_number', 'invalid_date', 'wrong_name_format'])
    
    if anomaly_type == 'invalid_passport_number':
        passport_data['passport_number'] = 'XXXXXXX'  # Introduce an invalid passport number
    elif anomaly_type == 'invalid_date':
        passport_data['expiry_date'] = '2023-02-30'  # Introduce an impossible date
    elif anomaly_type == 'wrong_name_format':
        passport_data['name'] = '1234'  # Introduce an invalid name format
    return passport_data

# Generate 110 passport entries
passport_data_list = []
for _ in range(110):
    passport_data = generate_passport_data()
    passport_data_list.append(passport_data)

# Introduce 10 anomalies
anomalies_indices = random.sample(range(110), 10)
for index in anomalies_indices:
    passport_data_list[index] = introduce_anomaly(passport_data_list[index])

# Convert to DataFrame for better presentation
df = pd.DataFrame(passport_data_list)

# Output the data
print(df)

# Optionally, save to CSV
df.to_csv('passport_data.csv', index=False)
