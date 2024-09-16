from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.ensemble import IsolationForest
import pandas as pd
import numpy as np
import pickle

df_aadhaar = pd.read_csv('aadhaar_data.csv')
df = df_aadhaar.copy()
df_aadhaar.fillna('Unknown', inplace=True)
df_aadhaar_info = pd.DataFrame()
df_aadhaar_info['name'] = df_aadhaar['name'].str.len()
df_aadhaar_info['dob_type'] = type(df_aadhaar['dob'].str)
df_aadhaar_info['dob'] = df_aadhaar['dob'].str.len()
df_aadhaar_info['address'] = df_aadhaar['address'].str.len()
df_aadhaar_info['aadhaar_number'] = df_aadhaar['aadhaar_number']
df_aadhaar_info['gender'] = df_aadhaar_info['gender']

label_encoder = LabelEncoder()
#onehot_encoder = OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore')
categorical_columns = df_aadhaar.select_dtypes(include=['object']).columns
for category in categorical_columns:
    df_aadhaar[category] = label_encoder.fit_transform(df_aadhaar[[category]])
#numerical_columns = ['aadhaar_number']
#scaler = StandardScaler()
#for num_col in numerical_columns:
#    df_aadhaar[num_col] = scaler.fit_transform(df_aadhaar[num_col].values.reshape(-1, 1))

#encoded_categorical_data = onehot_encoder.fit_transform(df_aadhaar[categorical_columns])
#encoded_df = pd.DataFrame(encoded_categorical_data, columns=onehot_encoder.get_feature_names_out(categorical_columns))
#df_aadhaar_encoded = pd.concat([df_aadhaar.drop(columns=categorical_columns), encoded_df], axis=1)
#print(df_aadhaar_encoded.head())

model = IsolationForest(contamination=0.005, n_estimators=150, warm_start=True, random_state=100, n_jobs=-1)
y_pred = model.fit_predict(df_aadhaar)

# Save the model to a .pkl file
with open('aadhaar_anomaly_model.pkl', 'wb') as file:
    pickle.dump(model, file)

print("Aadhaar model saved as aadhaar_anomaly_model.pkl")

n_outliers = sum(y_pred == -1)
n_inliers = sum(y_pred == 1)
print(f"Number of outliers detected: {n_outliers}")
print(f"Number of inliers detected: {n_inliers}")

outlier_indices = np.where(y_pred == -1)[0]
top_outliers = df.iloc[outlier_indices].sort_values(by=df.columns[0], ascending=False).head()
print("\nTop outliers:")
print(top_outliers)