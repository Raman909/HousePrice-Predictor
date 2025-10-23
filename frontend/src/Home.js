import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
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

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('https://houseprice-predictor-p3rk.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();

      // 🔹 Modified: Convert small model output (3.93) to full dollars (393,000)
      const rawValue = data.predicted_price || data.prediction;
      const convertedValue = rawValue * 100000; // 🔹 Multiply by 100k
      setPrediction(convertedValue); // 🔹 Set the converted value

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
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <div className="theme-toggle-inner">
          <span className={`theme-icon ${isDarkMode ? 'moon' : 'sun'}`}>
            {isDarkMode ? '🌙' : '☀️'}
          </span>
        </div>
      </button>

      <div className="home-content">
        <header className="home-header">
          <div className="header-icon">🏠</div>
          <h1 className="home-title">House Price Predictor</h1>
          <p className="home-subtitle">Enter property details to get an accurate price prediction</p>
        </header>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-grid">
            {inputFields.map((field) => (
              <div key={field.name} className="input-group">
                <label htmlFor={field.name} className="input-label">
                  {field.label}
                </label>
                <div className="input-wrapper">
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
                  <div className="input-glow"></div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            className={`predict-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            <span className="button-content">
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Predicting...
                </>
              ) : (
                <>
                  <span className="button-icon">🔮</span>
                  Predict Price
                </>
              )}
            </span>
            <div className="button-ripple"></div>
          </button>
        </form>

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <p>Error: {error}</p>
          </div>
        )}

        {prediction && (
          <div className="prediction-result">
            <div className="result-header">
              <div className="result-icon">💰</div>
              <h3 className="result-title">Predicted House Price</h3>
            </div>
            <div className="price-display">
              {/* 🔹 Modified: Show converted value in full dollars */}
              ${prediction.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
            <p className="result-subtitle">Based on your input data</p>
            <div className="result-decoration"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
