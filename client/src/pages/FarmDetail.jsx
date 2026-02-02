import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import '../styles/farm-detail.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";


const FarmDetail = () => {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [adviceHistory, setAdviceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('FarmDetail mounted with farmId:', farmId);
    fetchFarmData();
    fetchAdviceHistory();
  }, [farmId]);

  const fetchFarmData = async () => {
    try {
      console.log('Fetching farm data for:', farmId);
      const response = await api.get(`/farms/${farmId}`);
      console.log('Farm data received:', response.data);
      setFarm(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching farm:', err);
      setError(err.response?.data?.message || 'Failed to load farm details');
      setLoading(false);
    }
  };
const handleDownloadPDF = () => {
  const element = document.getElementById("advice-pdf");

  const options = {
    margin: 0.5,
    filename: `FarmVista_Advice_${farm.crop}_${new Date().toISOString().slice(0,10)}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(options).from(element).save();
};

  const fetchAdviceHistory = async () => {
    try {
      console.log('Fetching advice history for:', farmId);
      const response = await api.get(`/advice/farm/${farmId}`);
      console.log('Advice history:', response.data);
      setAdviceHistory(response.data);
      if (response.data.length > 0) {
        setAdvice(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to load advice history:', err);
    }
  };

  const handleGenerateAdvice = async () => {
    setGenerating(true);
    setError('');

    try {
      const response = await api.post(`/advice/generate/${farmId}`);
      setAdvice(response.data.advice);
      fetchAdviceHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate advice');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>
        <div className="loading">⏳ Loading farm details...</div>
      </div>
    );
  }
  if (!farm) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        <div className="error-message">❌ Farm not found</div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        <div className="error-message">⚠️ Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="farm-detail">
      <div className="farm-detail-header">
        <div className="header-content">
          <div className="farm-icon">🌾</div>
          <div>
            <h1>{farm.farmName}</h1>
            <p className="farm-location">
              📍 {farm.location.city || 'Unknown'}, {farm.location.state || 'Unknown'}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
          <Link to={`/edit-farm/${farm._id}`} className="btn btn-primary">
            Edit Farm
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="farm-detail-grid">
        <section className="farm-info-section">
          <h2>🌱 Farm Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>🌽 Crop</label>
              <p>{farm.crop}</p>
            </div>
            <div className="info-item">
              <label>📈 Stage</label>
              <p>{farm.cropStage}</p>
            </div>
            <div className="info-item">
              <label>🌍 Soil Type</label>
              <p>{farm.soilType}</p>
            </div>
            <div className="info-item">
              <label>📏 Area</label>
              <p>{farm.areaSqMeters?.toLocaleString()} sq meters</p>
            </div>
            
            <div className="info-item">
              <label>🏠 Location</label>
              <p>{farm.location.city || 'N/A'}, {farm.location.state || 'N/A'}</p>
            </div>
          </div>
        </section>

        <section className="advice-section">
          <h2>💡 AI Farming Advice</h2>
          
          {advice ? (
            <div className="advice-card">
              <div className="advice-meta">
                <span className="timestamp">
                  📅 Generated: {new Date(advice.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="badge ai-generated">✨ AI Generated</span>
              </div>

             {advice.weatherData && (
  <div className="weather-info">
    <h3>🌤️ Current Weather Conditions</h3>

    <div className="weather-grid">
      <div className="weather-item">
        <span className="weather-icon">🌡️</span>
        <span className="weather-label">Temperature</span>
        <span className="weather-value">
          {advice.weatherData.temperature}°C
        </span>
      </div>

      <div className="weather-item">
        <span className="weather-icon">💧</span>
        <span className="weather-label">Humidity</span>
        <span className="weather-value">
          {advice.weatherData.humidity}%
        </span>
      </div>

      <div className="weather-item">
        <span className="weather-icon">💨</span>
        <span className="weather-label">Wind Speed</span>
        <span className="weather-value">
          {advice.weatherData.windSpeed} m/s
        </span>
      </div>

      <div className="weather-item">
        <span className="weather-icon">🌤️</span>
        <span className="weather-label">Condition</span>
        <span className="weather-value">
          {advice.weatherData.description}
        </span>
      </div>
    </div>
  </div>
)}

              <div className="advice-text">
               <div className="advice-text" id="advice-pdf">
                 <h3>📋 Recommendations</h3>

                <div className="advice-content markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {advice.aiAdvice}
                </ReactMarkdown>
              </div>
             </div>


              </div>

              <div className="advice-actions">
                <button
                  onClick={handleGenerateAdvice}
                  disabled={generating}
                  className="btn btn-primary"
                >
                  {generating ? '✨ Generating...' : '✨ Generate New Advice'}
                </button>
                
                <button onClick={handleDownloadPDF} className="btn btn-secondary">📄 Download as PDF</button>

              </div>
            

            </div>
          ) : (
            <div className="empty-advice">
              <div className="empty-icon">💡</div>
              <h3>No Advice Generated Yet</h3>
              <p>Generate AI-powered farming advice based on your farm data and current weather conditions.</p>
              <button
                onClick={handleGenerateAdvice}
                disabled={generating}
                className="btn btn-primary"
              >
                {generating ? '✨ Generating...' : '✨ Generate Your First Advice'}
              </button>
            </div>
          )}
        </section>
      </div>

      {adviceHistory.length > 1 && (
        <section className="advice-history">
          <h2>📜 Advice History</h2>
          <div className="history-list">
            {adviceHistory.slice(1).map((item) => (
              <div
                key={item._id}
                className="history-item"
                onClick={() => setAdvice(item)}
              >
                <span className="date">
                  📅 {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="preview">{item.aiAdvice.substring(0, 150)}...</span>
                <span className="crop-type">{farm.crop}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FarmDetail;
