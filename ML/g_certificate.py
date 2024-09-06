import random
import pandas as pd
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Certificate types to choose from
certificate_types = ['Completion', 'Achievement', 'Excellence', 'Participation', 'Merit']

# Function to generate normal synthetic data for certificates
def generate_certificate_data(num_entries=50):
    certificate_data = []
    for _ in range(num_entries):
        name = fake.name()
        certificate_type = random.choice(certificate_types)
        description = fake.sentence(nb_words=10)
        
        certificate_data.append({
            'Name': name,
            'Certificate Type': certificate_type,
            'Description': description
        })
    
    return certificate_data

# Function to generate anomalous data for certificates
def generate_anomalous_certificate_data(num_entries=10):
    anomalous_data = []
    for _ in range(num_entries):
        anomaly_type = random.choice(['missing_name', 'invalid_type', 'empty_description', 'invalid_characters'])
        
        # Introduce anomalies based on the type
        if anomaly_type == 'missing_name':
            name = ''  # Missing name
        else:
            name = fake.name()
        
        if anomaly_type == 'invalid_type':
            certificate_type = random.choice(['InvalidType123', '@Certificate!', '12345'])  # Invalid certificate type
        else:
            certificate_type = random.choice(certificate_types)
        
        if anomaly_type == 'empty_description':
            description = ''  # Empty description
        elif anomaly_type == 'invalid_characters':
            description = ' '.join(random.choices(['@#$%', '!@#$', '^&*()'], k=5))  # Invalid characters in description
        else:
            description = fake.sentence(nb_words=10)
        
        anomalous_data.append({
            'Name': name,
            'Certificate Type': certificate_type,
            'Description': description
        })
    
    return anomalous_data

# Generate normal and anomalous data
normal_data = generate_certificate_data(num_entries=100)
anomalous_data = generate_anomalous_certificate_data(num_entries=10)

# Combine normal and anomalous data
combined_data = normal_data + anomalous_data

# Convert to DataFrame and save to CSV
df_certificates = pd.DataFrame(combined_data)
df_certificates.to_csv('synthetic_certificate_data.csv', index=False)

print(df_certificates)
