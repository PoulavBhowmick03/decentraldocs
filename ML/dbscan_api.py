import pandas as pd
import pickle
from flask import Flask, request, jsonify
from sklearn.preprocessing import LabelEncoder, StandardScaler
import numpy as np
from checks import extract_features

# Load the saved model
with open('aadhaar_dbscan_anomaly_model.pkl', 'rb') as file:
    dbscan_model = pickle.load(file)

# Initialize Flask app
app = Flask(__name__)

# Predefined encoders for preprocessing categorical features
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
        label_encoders[col].fit(['MALE', 'Female', 'Unknown'])
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

# Define the predict route
@app.route('/predict_aadhaar', methods=['POST'])
def predict_anomaly():
    data = request.json  # Input data should be a JSON object
    df = pd.DataFrame([data])
    df.drop(columns=['address_entities'], inplace=True)
    #df.drop(index=[1,2,3,4], inplace=True)

    df = extract_features(df)  

    # Preprocess the input data
    for col in categorical_columns:
        if col in df:
            df[col] = label_encoders[col].transform(df[col])

    # Optionally, scale numerical data if required
    #for col in numerical_columns:
     #   if col in df:
      #      df[col] = scaler.fit_transform(df[col].values.reshape(-1, 1))
    print(df)

    # Make predictions using the model
    prediction = dbscan_model.fit_predict(df)

    # Check if the prediction is an anomaly (outlier is represented by -1 in DBSCAN)
    is_anomaly = prediction[0] == -1

    # Return the prediction result as a JSON response
    return jsonify({'anomaly': bool(is_anomaly)})

if __name__ == '__main__':
    app.run(debug=True)
