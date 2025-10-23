from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os

app = Flask(__name__)
CORS(app)

# Load model
model_path = "model.pkl"

if os.path.exists(model_path):
    model = pickle.load(open(model_path, "rb"))
    print("✅ Model loaded successfully!")
else:
    model = None
    print("⚠️ Model file not found! Please check model.pkl")

@app.route('/')
def home():
    return jsonify({"message": "House Price Prediction API is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        features = [
            float(data['MedInc']),
            float(data['HouseAge']),
            float(data['AveRooms']),
            float(data['AveBedrms']),
            float(data['Population']),
            float(data['AveOccup']),
            float(data['Latitude']),
            float(data['Longitude'])
        ]

        features_array = np.array([features])

        if model is not None:
            prediction = model.predict(features_array)[0]
        else:
            return jsonify({'error': 'Model not loaded'}), 500

        return jsonify({'predicted_price': float(prediction)})

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
