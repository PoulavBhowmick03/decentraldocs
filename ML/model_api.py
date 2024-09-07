import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import joblib
import json
from flask import Flask, request, jsonify

# Initialize Flask app
app = Flask(__name__)

# Load the trained model and preprocessor
model = joblib.load("certidicate.pkl")

# Function to preprocess new data using the same steps as training
def preprocess_new_data(new_data):
    # Load the training dataset to extract the column names and fit the preprocessor
    df = pd.read_csv('synthetic_certificate_data.csv')
    
    # Combine both dataframes to ensure the columns match
    combined_data = df._append(new_data, ignore_index=True)
    
    # Select numeric and categorical features
    numeric_features = combined_data.select_dtypes(include=['int64', 'float64']).columns
    categorical_features = combined_data.select_dtypes(include=['object']).columns
    datetime_features = combined_data.select_dtypes(include=['datetime64']).columns

    # Convert categorical features to string type
    for col in categorical_features:
        combined_data[col] = combined_data[col].astype(str)

    # Extract datetime features
    def extract_datetime_features(df):
        for col in datetime_features:
            df[f'{col}_year'] = df[col].dt.year
            df[f'{col}_month'] = df[col].dt.month
            df[f'{col}_day'] = df[col].dt.day
            df[f'{col}_dayofweek'] = df[col].dt.dayofweek
            df[f'{col}_hour'] = df[col].dt.hour
        return df
    
    combined_data = extract_datetime_features(combined_data)

    # Update numeric features to include new datetime features and exclude categorical
    numeric_features = [col for col in combined_data.columns if col not in categorical_features and col not in datetime_features]

    # Define the preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), categorical_features)
        ])

    # Fit the preprocessor only on the training data
    preprocessor.fit(df)

    # Transform the new data using the fitted preprocessor
    X_preprocessed = preprocessor.transform(new_data)
    
    # Get the feature names after one-hot encoding
    onehot_columns = preprocessor.named_transformers_['cat'].get_feature_names_out(categorical_features)
    feature_names = numeric_features + list(onehot_columns)
    
    return X_preprocessed, feature_names

# Route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse JSON request data
        json_data = request.json
        
        # Convert JSON data to a DataFrame
        df = pd.DataFrame([json_data])
        
        # Preprocess the new data
        X_new, feature_names = preprocess_new_data(df)
        
        # Predict using the trained model
        y_pred = model.predict(X_new)
        
        # Return the result as JSON
        result = {"outlier": True if y_pred[0] == -1 else False}
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)})

# Main function to run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
