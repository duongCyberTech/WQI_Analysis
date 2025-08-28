import pickle
from fastapi import FastAPI
import pandas as pd
from pydantic import BaseModel
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sqlalchemy import create_engine, text, Table, MetaData, update
import pymysql
import os

class InputData(BaseModel):
    place: Dict[str, float]
    temperature: Dict[str, float]
    pH: Dict[str, float]
    DO: Dict[str, float]
    conductivity: Dict[str, float]
    alkalinity: Dict[str, float]
    no2: Dict[str, float]
    nh4: Dict[str, float]
    po4: Dict[str, float]
    h2s: Dict[str, float]
    tss: Dict[str, float]
    cod: Dict[str, float]
    aeromonas_total: Dict[str, float]
    edwardsiella_ictaluri: Dict[str, float]
    aeromonas_hydrophila: Dict[str, float]
    coliform: Dict[str, float]

with open("model_v2.pkl", 'rb') as f:
    my_model_clf = pickle.load(f)

app = FastAPI()

# Cấu hình CORS
origins = [
    "http://localhost:3000",  # Địa chỉ React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Cho phép chỉ từ React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức (GET, POST, PUT...)
    allow_headers=["*"],  # Cho phép tất cả các header
)

DB_URI = "mysql+pymysql://root:123456@localhost:3306/do_an_HTTT"

def get_data_count(engine):
    with engine.connect() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM alldata"))
        count = result.scalar()
        return count

def train_model(df):
    xgboost = XGBRegressor()
    model = xgboost.fit(df.drop(columns=["wqi", 'water_quality', 'id', 'province', 'district', 'observation_point', 'date', 'coordinate']), df["wqi"])
    return model

def save_model(model, path="./model_v2.pkl"):
    with open(path, "wb") as f:
        pickle.dump(model, f)
    print(f"Model saved to {path}")

def retrain_model(df, model_path="./model_v2.pkl"):
    model = train_model(df)
    save_model(model, model_path)

@app.post("/test")
def read_items(data: InputData):
    global my_model_clf
    if os.path.exists("temp_xg.pkl"):
        print("Found temp_xg.pkl, updating model_v2.pkl")
        os.remove("model_v2.pkl")
        os.rename("temp_xg.pkl", "model_v2.pkl")
    df = pd.DataFrame({k: list(v.values())[0] for k, v in data.dict().items()}, index=[0])
    prediction = my_model_clf.predict(df)
    return {"prediction": prediction.tolist()}

class CBInputData(BaseModel):
    temperature: Dict[str, float]
    pH: Dict[str, float]
    DO: Dict[str, float]
    conductivity: Dict[str, float]
    alkalinity: Dict[str, float]
    no2: Dict[str, float]
    nh4: Dict[str, float]
    po4: Dict[str, float]
    h2s: Dict[str, float]
    tss: Dict[str, float]
    cod: Dict[str, float]
    aeromonas_total: Dict[str, float]
    edwardsiella_ictaluri: Dict[str, int]
    aeromonas_hydrophila: Dict[str, int]
    coliform: Dict[str, float]

@app.post("/cb")
def cb_model(data: CBInputData):
    with open("model_CB.pkl", 'rb') as f:
        cb_clf = pickle.load(f)
    
    # Prepare the dataframe
    df = pd.DataFrame({k: list(v.values())[0] for k, v in data.dict().items()}, index=[0])
    
    # Ensure correct types for features
    for col in df.columns:
        if col in ['edwardsiella_ictaluri', 'aeromonas_hydrophila']:
            # Convert categorical columns to integers (or strings if necessary)
            df[col] = df[col].astype(int)
        else:
            # Convert other columns to floats
            df[col] = df[col].astype(float)
    
    # Now the dataframe is properly formatted, we can make predictions
    prediction = cb_clf.predict(df)
    
    return {"prediction": prediction.tolist()}

@app.post("/mlp")
def mlp_model(data: CBInputData):
    with open("model_MLP.pkl", 'rb') as f:
        cb_clf = pickle.load(f)
    df = pd.DataFrame({k: list(v.values())[0] for k, v in data.dict().items()}, index=[0])
    prediction = cb_clf.predict(df)
    return {"prediction": prediction.tolist()}  

@app.post("/et")
def exTree_model(data: CBInputData):
    with open("model_ET.pkl", 'rb') as f:
        cb_clf = pickle.load(f)
    df = pd.DataFrame({k: list(v.values())[0] for k, v in data.dict().items()}, index=[0])
    prediction = cb_clf.predict(df)
    return {"prediction": prediction.tolist()}  

@app.post("/rf")
def cb_model(data: CBInputData):
    with open("model_RF.pkl", 'rb') as f:
        cb_clf = pickle.load(f)
    df = pd.DataFrame({k: list(v.values())[0] for k, v in data.dict().items()}, index=[0])
    prediction = cb_clf.predict(df)
    return {"prediction": prediction.tolist()}  

@app.post("/")
def read_root():
    return {"Hello": "World"}

@app.post("/health")
def health_check():
    return {"status": "healthy"}
