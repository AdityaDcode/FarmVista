import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await api.get('/farms');
      setFarms(response.data);
    } catch (err) {
      setError('Failed to load farms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      try {
        await api.delete(`/farms/${farmId}`);
        setFarms(farms.filter((farm) => farm._id !== farmId));
      } catch (err) {
        setError('Failed to delete farm');
      }
    }
  };

  // Calculate stats
  const totalFarms = farms.length;
  const totalArea = farms.reduce((sum, farm) => sum + (farm.areaSqMeters || 0), 0);
  const uniqueCrops = [...new Set(farms.map(f => f.crop))].length;

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>
          <span className="header-icon">🌾</span>
          Welcome back, {user?.name}!
        </h1>
        <p>Manage your farms and get AI-powered farming advice all in one place.</p>
      </header>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-value">{totalFarms}</div>
          <div className="stat-label">Total Farms</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📐</div>
          <div className="stat-value">{totalArea.toLocaleString()}</div>
          <div className="stat-label">Total Area (sq.m)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌽</div>
          <div className="stat-value">{uniqueCrops}</div>
          <div className="stat-label">Crop Types</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-value">AI</div>
          <div className="stat-label">Smart Insights</div>
        </div>
      </div>

      <section className="dashboard-actions">
        <Link to="/add-farm" className="btn btn-primary">
          ➕ Add New Farm
        </Link>
        <Link to="/advice" className="btn btn-secondary">
          📊 View All Advice
        </Link>
      </section>

      {error && <div className="error-message">{error}</div>}

      <section className="farms-section">
        <div className="farms-header">
          <h2>
            <span>🌾</span>
            Your Farms
            <span className="farms-count">{totalFarms} farms</span>
          </h2>
        </div>

        {farms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <h3>No Farms Yet</h3>
            <p>You haven't added any farms. Start by adding your first farm to get AI-powered insights.</p>
            <Link to="/add-farm" className="btn btn-primary">
              Add Your First Farm
            </Link>
          </div>
        ) : (
          <div className="farms-grid">
            {farms.map((farm) => (
              <div key={farm._id} className="farm-card">
                <div className="farm-header">
                  <h3>
                    <span className="farm-icon">🌾</span>
                    {farm.farmName}
                  </h3>
                  <span className="crop-badge">{farm.crop}</span>
                </div>

                <div className="farm-details">
                  <div className="farm-detail-row">
                    <span className="detail-icon">🪴</span>
                    <div className="detail-content">
                      <div className="detail-label">Crop</div>
                      <div className="detail-value">{farm.crop}</div>
                    </div>
                  </div>
                  <div className="farm-detail-row">
                    <span className="detail-icon">🌍</span>
                    <div className="detail-content">
                      <div className="detail-label">Soil Type</div>
                      <div className="detail-value">{farm.soilType}</div>
                    </div>
                  </div>
                  <div className="farm-detail-row">
                    <span className="detail-icon">📈</span>
                    <div className="detail-content">
                      <div className="detail-label">Stage</div>
                      <div className="detail-value">{farm.cropStage}</div>
                    </div>
                  </div>
                  <div className="farm-detail-row">
                    <span className="detail-icon">📏</span>
                    <div className="detail-content">
                      <div className="detail-label">Area</div>
                      <div className="detail-value">{farm.areaSqMeters?.toLocaleString()} sq meters</div>
                    </div>
                  </div>
                </div>

                <div className="farm-actions">
                  <Link to={`/farm/${farm._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(farm._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
