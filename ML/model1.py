import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import joblib
import json

model = joblib.load("certidicate.pkl")

json_file = "output.json"

data = json.load(open(json_file))
df = pd.DataFrame([data])
def preprocess_data(data):
    df = pd.read_csv('synthetic_certificate_data.csv')
    data = df._append(data, ignore_index=True)
    numeric_features = data.select_dtypes(include=['int64', 'float64']).columns
    categorical_features = data.select_dtypes(include=['object']).columns
    datetime_features = data.select_dtypes(include=['datetime64']).columns

    # Convert categorical features to string type
    for col in categorical_features:
        data[col] = data[col].astype(str)

    # Function to extract datetime features
    def extract_datetime_features(df):
        for col in datetime_features:
            df[f'{col}_year'] = df[col].dt.year
            df[f'{col}_month'] = df[col].dt.month
            df[f'{col}_day'] = df[col].dt.day
            df[f'{col}_dayofweek'] = df[col].dt.dayofweek
            df[f'{col}_hour'] = df[col].dt.hour
        return df

    # Extract datetime features
    data = extract_datetime_features(data)

    # Update numeric features to include new datetime features and exclude categorical
    numeric_features = [col for col in data.columns if col not in categorical_features and col not in datetime_features]

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), categorical_features)
        ])

    X_preprocessed = preprocessor.fit_transform(data)
    
    onehot_columns = preprocessor.named_transformers_['cat'].get_feature_names_out(categorical_features)
    feature_names = numeric_features + list(onehot_columns)
    
    return X_preprocessed, feature_names

X_new, feature_names = preprocess_data(df)

print(X_new, feature_names, sep='\n')

X_new = X_new[:, 3:]
y_pred = model.predict(X_new)
print(y_pred[0])