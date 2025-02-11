from fastapi import FastAPI
import pickle
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware


with open("./model/house_prediction_model.pkl", "rb") as file:
    model = pickle.load(file)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Message": "Welcome to the Recommendation API"}


@app.post("/recommendation/")
def get_recommendation(data: dict):
    print('data received from the frontend: ')
    print(data)

    new_house_features = {
        'Land Area': float(data['area']),
        'Bedrooms': float(data['bedroom']),
        'Bathrooms': float(data['bathroom']),
        'Floors': float(data['stories']),
        'City': data['city'],
        'District': data['district'],
        'car_parking': float(data['car_parking']),
    }
    # Convert the features to a DataFrame
    new_house_df = pd.DataFrame([new_house_features])
    
    predicted_price = model.predict(new_house_df)

    new_price = (int(predicted_price[0]) * 0.03 ) // 12

    print("New Price Should be {}".format(new_price))

    return {"Price": new_price}


import uvicorn

if __name__ == "__main__":
    uvicorn.run(app=app, port=8000)