import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

def load_data(file_path):
    return pd.read_csv(file_path, parse_dates=True)

def preprocess_data(data):
    numeric_features = data.select_dtypes(include=['int64', 'float64']).columns
    categorical_features = data.select_dtypes(include=['object', 'int64', 'float64']).columns
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

def train_and_predict_isolation_forest(X, contamination=0.1, random_state=42):
    clf = IsolationForest(contamination=contamination, random_state=random_state)
    y_pred = clf.fit_predict(X)
    return clf, y_pred

def visualize_results(X, y_pred, title):
    pca = PCA(n_components=2)
    X_2d = pca.fit_transform(X)
    
    plt.figure(figsize=(10, 6))
    plt.scatter(X_2d[:, 0], X_2d[:, 1], c=y_pred, cmap='viridis')
    plt.title(title)
    plt.xlabel('First Principal Component')
    plt.ylabel('Second Principal Component')
    plt.colorbar(ticks=[-1, 1], label='Prediction')
    plt.show()

def main():
    # Load data
    data = load_data('synthetic_certificate_data.csv')  
    #data2 = load_data('anomalous_voter_id_data.csv')  

    #data = pd.concat([data1, data2], ignore_index=True)
    # Preprocess data
    X, feature_names = preprocess_data(data)
    
    # Train Isolation Forest and predict anomalies
    clf, y_pred = train_and_predict_isolation_forest(X)
    
    # Print results
    n_outliers = sum(y_pred == -1)
    n_inliers = sum(y_pred == 1)
    print(f"Number of outliers detected: {n_outliers}")
    print(f"Number of inliers detected: {n_inliers}")
    
    # Visualize results
    visualize_results(X, y_pred, "Isolation Forest Results")
    
    # Print feature names
    print("\nFeature names after preprocessing:")
    print(feature_names)

    # Print top outliers
    outlier_indices = np.where(y_pred == -1)[0]
    top_outliers = data.iloc[outlier_indices].sort_values(by=data.columns[0], ascending=False).head()
    print("\nTop outliers:")
    print(top_outliers)

    # Save model
    import joblib
    joblib.dump(clf, "certidicate.pkl")
if __name__ == "__main__":
    main()