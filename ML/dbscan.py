from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import DBSCAN
import pandas as pd
import numpy as np
import pickle

# Load the Aadhaar dataset
df_aadhaar = pd.read_csv('extracted_features_aadhaar.csv')
df = pd.read_csv('aadhaar_data.csv')
# Fill missing values
#df_aadhaar.fillna('Unknown', inplace=True)
categorical_columns = ['name_type','dob_valid',
                       'gender','masked_aadhaar',
                       'address_type',
                       'aadhaar_valid']  # Replace with actual categorical columns from Aadhaar data
label_encoders = {col: LabelEncoder() for col in categorical_columns}
numerical_columns = ['name_length', 'aadhaar_number_length', 'address_length']
# Replace with fit encoders from training data
# Example of fitting an encoder with training data (use actual data columns during model training)
for col in categorical_columns:
    if col == 'name_type':
        label_encoders[col].fit(['full_name', 'single_name', 'missing'])
    elif col == 'dob_valid':
        label_encoders[col].fit([True, False])
    elif col == 'gender':
        label_encoders[col].fit(['Male', 'Female', 'Unknown'])
    elif col == 'masked_aadhaar':
        label_encoders[col].fit([True, False])
    elif col == 'address_type':
        label_encoders[col].fit(['detailed', 'short', 'missing'])
    elif col == 'aadhaar_valid':
        label_encoders[col].fit([True, False])
    else:
        label_encoders[col].fit(['Unknown'])
# StandardScaler from training
scaler = StandardScaler()
# Print the shape of the dataset to understand its size
print(f"Original dataset shape: {df_aadhaar.shape}")

# Identify categorical columns
print(f"Categorical columns: {categorical_columns}")
# Label encode the categorical columns
for category in categorical_columns:
    df_aadhaar[category] = label_encoders[col].transform(df_aadhaar[category])

# Print the shape of the dataset after encoding
print(f"Dataset shape after label encoding: {df_aadhaar.shape}")

# (Optional) Scale numeric columns if necessary
#for num_col in numerical_columns:
 #   df_aadhaar[num_col] = scaler.fit_transform(df_aadhaar[num_col].values.reshape(-1, 1))

# Print message indicating that scaling is complete
print("Scaling complete. Proceeding with DBSCAN...")
print(df_aadhaar.head())
df_aadhaar.fillna(0, inplace=True)
print(df_aadhaar.isnull().sum())
# Apply DBSCAN clustering for anomaly detection
# Adjust eps and min_samples based on dataset size and density
try:
    dbscan = DBSCAN(eps=1, min_samples=2, n_jobs=-1, algorithm='auto', metric='euclidean')
    y_pred = dbscan.fit_predict(df_aadhaar)
except MemoryError as mem_err:
    print("Memory Error: The dataset might be too large for the current system. Try reducing the size.")
    exit(1)

# Check for outliers
n_outliers = sum(y_pred == -1)
n_inliers = sum(y_pred != -1)
print(f"Number of outliers detected: {n_outliers}")
print(f"Number of inliers detected: {n_inliers}")

# Save the DBSCAN model to a .pkl file
with open('aadhaar_dbscan_anomaly_model.pkl', 'wb') as file:
    pickle.dump(dbscan, file)

print("DBSCAN model saved as aadhaar_dbscan_anomaly_model.pkl")

# Identify and show the top outliers
outlier_indices = np.where(y_pred == -1)[0]
top_outliers = df.iloc[outlier_indices].sort_values(by=df.columns[0], ascending=False).head(58)
print("\nTop outliers:")
print(top_outliers)
