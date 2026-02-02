import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import '../styles/advice-list.css';

const AllAdvice = () => {
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAdvice, setSelectedAdvice] = useState(null);

  useEffect(() => {
    fetchAllAdvice();
  }, []);

  const fetchAllAdvice = async () => {
    try {
      const response = await api.get('/advice');
      setAdvices(response.data);
    } catch (err) {
      setError('Failed to load advice');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading advice...</div>;

  return (
    <div className="advice-list-page">
      <div className="page-header">
        <div className="header-icon">💡</div>
        <h1>All Advice History</h1>
        <p>View all your AI-generated farming advice and recommendations</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {advices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3>No Advice Generated Yet</h3>
          <p>Add a farm and generate AI-powered farming advice to see it here!</p>
          <Link to="/add-farm" className="btn btn-primary">
            Add Your First Farm
          </Link>
        </div>
      ) : (
        <div className="advice-list-grid">
          {advices.map((advice) => (
            <div
              key={advice._id}
              className={`advice-list-item ${selectedAdvice?._id === advice._id ? 'active' : ''}`}
              onClick={() => setSelectedAdvice(advice)}
            >
              <div className="item-header">
                <h3>
                  <span className="item-icon">🌽</span>
                  {advice.farmData.crop}
                </h3>
                <span className="date">
                  📅 {new Date(advice.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="item-info">
                <p><span>🏠</span> <strong>Farm:</strong> {advice.farmData.farmName}</p>
                <p><span>📈</span> <strong>Stage:</strong> {advice.farmData.cropStage}</p>
                {advice.weatherData && (
                  <p><span>🌡️</span> <strong>Temp:</strong> {advice.weatherData.temperature}°C</p>
                )}
              </div>

              <div className="item-preview">
                {advice.aiAdvice.substring(0, 150)}...
              </div>

              <div className="item-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAdvice(advice);
                  }}
                  className="btn btn-small btn-primary"
                >
                  View Full
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAdvice && (
        <div className="advice-modal" onClick={() => setSelectedAdvice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedAdvice(null)}
              className="modal-close"
            >
              ✕
            </button>

            <div className="modal-header">
              <h2>🌽 {selectedAdvice.farmData.crop}</h2>
            </div>

            <div className="modal-meta">
              <div className="modal-meta-item">
                <span>🏠</span>
                <span><strong>Farm:</strong> {selectedAdvice.farmData.farmName}</span>
              </div>
              <div className="modal-meta-item">
                <span>🌍</span>
                <span><strong>Soil:</strong> {selectedAdvice.farmData.soilType}</span>
              </div>
              <div className="modal-meta-item">
                <span>📈</span>
                <span><strong>Stage:</strong> {selectedAdvice.farmData.cropStage}</span>
              </div>
              <div className="modal-meta-item">
                <span>📅</span>
                <span><strong>Date:</strong> {new Date(selectedAdvice.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>

            {selectedAdvice.weatherData && (
              <div className="modal-weather">
                <h3>🌤️ Weather Conditions</h3>
                <div className="weather-grid">
                  <div className="weather-item">
                    <span className="weather-label">Temperature</span>
                    <span className="weather-value">{selectedAdvice.weatherData.temperature}°C</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">Humidity</span>
                    <span className="weather-value">{selectedAdvice.weatherData.humidity}%</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">Wind Speed</span>
                    <span className="weather-value">{selectedAdvice.weatherData.windSpeed} m/s</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">Condition</span>
                    <span className="weather-value">{selectedAdvice.weatherData.description}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="modal-advice">
              <h3>📋 Recommendations</h3>
              <div className="advice-content">
                {selectedAdvice.aiAdvice}
              </div>
            </div>

            <div className="modal-actions">
              <Link to={`/farm/${selectedAdvice.farmData._id}`} className="btn btn-primary">
                View Farm Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAdvice;
