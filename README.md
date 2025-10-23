# HousePrice-Predictor

A full-stack house price prediction application using **React.js** (frontend), **Flask** (backend), and an **XGBoost** machine learning model. Users can enter property details to get accurate house price predictions in USD.

---

## 🔹 Features

- Interactive React.js frontend with dark/light mode toggle.
- Flask backend serving prediction API.
- XGBoost model trained on California housing dataset.
- Predicts house prices based on features like:
  - Median Income
  - House Age
  - Average Rooms
  - Average Bedrooms
  - Population
  - Average Occupancy
  - Latitude & Longitude
- Predictions displayed in full USD amount.

---

## 🔹 Folder Structure

HousePrice-Predictor/
│
├── frontend/ # React.js frontend
│ ├── public/
│ ├── src/
│ │ ├── Home.js
│ │ └── Home.css
│ └── package.json
│
├── backend/ # Flask backend
│ ├── app.py
│ ├── model.pkl
│ └── requirements.txt
│
└── README.md



---

## 🔹 Installation & Setup

### 1️⃣Backend (Flask)

```
cd backend
pip install -r requirements.txt
python app.py
```
2️⃣ Frontend(React) 
```
cd frontend
npm install
npm start
```


🔹 Usage

Open the frontend in your browser.
Enter property details in the form.
Click Predict Price.
See predicted house price in USD.



🔹 Tech Stack
Frontend: React.js, CSS
Backend: Flask, Flask-CORS
Machine Learning: Python, XGBoost, Scikit-learn, Pandas, Numpy
Visualization: Matplotlib, Seaborn
Development Tools: VS Code, Git

🔹 License
---
✅ This README gives a **clear overview**, instructions to run both frontend and backend, and a professional look for GitHub.
---



