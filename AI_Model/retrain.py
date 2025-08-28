import pickle
import os
import time
import json
import pandas as pd
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sqlalchemy import create_engine, text
import pymysql

COUNT_FILE = "count.json"
DB_URL = "mysql+pymysql://root:123456@localhost/do_an_HTTT"

def connectdb():
    engine = create_engine(DB_URL)
    return engine.connect()

def load_count_data():
    if not os.path.exists(COUNT_FILE):
        data = {"previous": 0, "current": 0}
        with open(COUNT_FILE, "w") as f:
            json.dump(data, f)
        return data

    with open(COUNT_FILE, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = {"previous": 0, "current": 0}

    # Đảm bảo đủ key
    data.setdefault("previous", 0)
    data.setdefault("current", 0)
    return data

def save_count_data(prev, curr):
    """Ghi file count.json"""
    with open(COUNT_FILE, "w") as f:
        json.dump({"previous": prev, "current": curr}, f)

def main():
    while True:
        # Lấy dữ liệu hiện tại từ DB
        conn = connectdb()
        count_record = conn.execute(text("SELECT COUNT(*) FROM alldata")).scalar()

        # Đọc dữ liệu từ file JSON
        count_data = load_count_data()
        prev = count_data["previous"]
        curr = count_record

        # Log để theo dõi
        change_ratio = (curr - prev) / prev if prev > 0 else None
        print(f"[DB] Current: {curr} | Prev: {prev} | Change: {change_ratio}")

        retrained = False
        if prev > 0 and change_ratio is not None and change_ratio >= 0.05:
            df = pd.read_sql("SELECT * FROM alldata", conn)
            X = df.drop(columns=["wqi", "observation_point", "date", "coordinate", "district", "id", "province", "water_quality"])
            print(X.columns)
            y = df["wqi"]

            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            model = XGBRegressor()
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            print("✅ R2 Score:", r2_score(y_test, preds))

            with open("temp_xg.pkl", "wb") as f:
                pickle.dump(model, f)

            prev = curr  # cập nhật previous khi retrain
            retrained = True

        # Luôn lưu file với current mới nhất
        save_count_data(prev, curr)

        if retrained:
            print(f"📄 count.json updated after retraining: previous={prev}, current={curr}")
        else:
            print(f"📄 count.json updated: previous={prev}, current={curr}")
        time.sleep(10)

if __name__ == "__main__":
    print("🚀 Starting model retraining monitor...")
    main()
