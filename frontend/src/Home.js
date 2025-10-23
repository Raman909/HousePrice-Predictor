import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  // 🔹 Modified: Use Render deployed backend URL
  const API_URL = process.env.REACT_APP_API_URL || "https://houseprice-predictor-p3rk.onrender.com";

  const [formData, setFormData] = useState({
    MedInc: '',
    HouseAge: '',
    AveRooms: '',
    AveBedrms: '',
    Population: '',
    AveOccup: '',
    Latitude: '',
    Longitude: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    else setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to get prediction');

      const data = await response.json();

      // 🔹 Convert model output (like 3.93) to full dollars
      const rawValue = data.predicted_price || data.prediction;
      const convertedValue = rawValue * 100000; // 🔹 multiply by 100k
      setPrediction(convertedValue); // 🔹 set converted value
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'MedInc', label: 'Median Income', placeholder: 'Enter Median Income' },
    { name: 'HouseAge', label: 'House Age', placeholder: 'Enter House Age (years)' },
    { name: 'AveRooms', label: 'Average Rooms', placeholder: 'Enter Average Rooms' },
    { name: 'AveBedrms', label: 'Average Bedrooms', placeholder: 'Enter Average Bedrooms' },
    { name: 'Population', label: 'Population', placeholder: 'Enter Population' },
    { name: 'AveOccup', label: 'Average Occupancy', placeholder: 'Enter Average Occupancy' },
    { name: 'Latitude', label: 'Latitude', placeholder: 'Enter Latitude' },
    { name: 'Longitude', label: 'Longitude', placeholder: 'Enter Longitude' }
  ];

  return (
    <div className="home-container">
      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        <span className="theme-icon">{isDarkMode ? '🌙' : '☀️'}</span>
      </button>

      <div className="home-content">
        <header className="home-header">
          <h1 className="home-title">🏠 House Price Predictor</h1>
          <p className="home-subtitle">Enter property details to get an accurate price prediction</p>
        </header>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-grid">
            {inputFields.map(field => (
              <div key={field.name} className="input-group">
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  type="number"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  step="any"
                  required
                  className="form-input"
                />
              </div>
            ))}
          </div>

          <button type="submit" className={`predict-button ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? 'Predicting...' : '🔮 Predict Price'}
          </button>
        </form>

        {error && <div className="error-message">⚠️ {error}</div>}

        {prediction && (
          <div className="prediction-result">
            <h3>💰 Predicted House Price</h3>
            {/* 🔹 Show full dollar value */}
            <div className="price-display">${prediction.toLocaleString('en-US')}</div>
            <p>Based on your input data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
