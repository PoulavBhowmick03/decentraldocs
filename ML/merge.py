import pandas as pd
df1 = pd.read_csv('anomalous_pan_data.csv')
df2 = pd.read_csv('valid_pan_data.csv')
df = pd.concat([df1, df2], ignore_index=True)
df = df.sample(frac=1).reset_index(drop=True)
df.to_csv('pan_data.csv', index=False)
print(len(df))