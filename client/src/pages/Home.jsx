import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        {/* Animated Background */}
        <div className="hero-bg-animation">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        
        {/* Decorative Grid */}
        <div className="hero-grid"></div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🌾</span>
            <span className="badge-text">Smart Agriculture Platform</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-farm">Farm</span>
            <span className="title-vista">Vistaaa</span>
          </h1>
          
          <p className="hero-subtitle">
            AI-Powered Farming Decision Support System for the Modern Agriculturist
          </p>
          
          {/* Floating Stats */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Weather Monitoring</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">AI</div>
              <div className="stat-label">Powered Insights</div>
            </div>
            
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="wave-separator">
          <svg viewBox="0 0 1440 120" className="wave-svg">
            <path fill="#ffffff" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </header>

      {user ? (
        // Logged In View
        <main className="main-content">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-decoration"></div>
            <div className="welcome-content">
              <div className="welcome-header">
                <span className="welcome-emoji">👋</span>
                <h2 className="welcome-title">Welcome back, {user.name}!</h2>
              </div>
              <p className="welcome-text">Get personalized farming advice based on real-time weather and soil data</p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="actions-grid">
            <Link to="/dashboard" className="action-card">
              <div className="action-icon icon-blue">📊</div>
              <h3 className="action-title">Dashboard</h3>
              <p className="action-desc">View your farms and latest insights at a glance</p>
              <div className="action-link">
                Open <span className="arrow">→</span>
              </div>
            </Link>

            <Link to="/add-farm" className="action-card">
              <div className="action-icon icon-green">➕</div>
              <h3 className="action-title">Add Farm</h3>
              <p className="action-desc">Register a new farm and start monitoring</p>
              <div className="action-link">
                Create <span className="arrow">→</span>
              </div>
            </Link>

            <Link to="/advice" className="action-card">
              <div className="action-icon icon-orange">💡</div>
              <h3 className="action-title">Get Advice</h3>
              <p className="action-desc">Generate AI-powered farming recommendations</p>
              <div className="action-link">
                Generate <span className="arrow">→</span>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <div className="features-container">
            <h3 className="features-heading">Why Choose FarmVista?</h3>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <div className="feature-content">
                  <h4 className="feature-title">Real-time Weather</h4>
                  <p className="feature-desc">Live weather integration</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤖</div>
                <div className="feature-content">
                  <h4 className="feature-title">AI Insights</h4>
                  <p className="feature-desc">Powered by Gemini AI</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎤</div>
                <div className="feature-content">
                  <h4 className="feature-title">Voice Playback</h4>
                  <p className="feature-desc">Listen to advice anywhere</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <div className="feature-content">
                  <h4 className="feature-title">Responsive Design</h4>
                  <p className="feature-desc">Works on all devices</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔐</div>
                <div className="feature-content">
                  <h4 className="feature-title">Secure & Private</h4>
                  <p className="feature-desc">Your data is protected</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <div className="feature-content">
                  <h4 className="feature-title">Track History</h4>
                  <p className="feature-desc">Monitor your progress</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        // Landing Page View
        <main className="main-content">
          {/* Hero Content */}
          <div className="landing-hero">
            <h2 className="landing-title">
              Empower Your Farming with <span className="gradient-text">Artificial Intelligence</span>
            </h2>
            <p className="landing-subtitle">
              Transform raw farm data into actionable insights in seconds. Make smarter decisions with AI-powered recommendations tailored to your land.
            </p>
            
            <div className="landing-buttons">
              <Link to="/register" className="btn btn-primary">
                Get Started Free →
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
            
            <p className="landing-note">No credit card required • Free forever</p>
          </div>

          {/* Feature Cards */}
          <div className="landing-features">
            <div className="feature-card">
              <div className="feature-card-icon icon-blue-gradient">🌡️</div>
              <h4 className="feature-card-title">Live Weather Data</h4>
              <p className="feature-card-desc">Real-time weather integration for precise forecasting and planning</p>
            </div>
            {/* <div className="feature-card">
              <div className="feature-card-icon icon-orange-gradient">🧪</div>
              <h4 className="feature-card-title">Soil Analysis</h4>
              <p className="feature-card-desc">Track soil composition and optimize crop selection for maximum yield</p>
            </div> */}
            <div className="feature-card">
              <div className="feature-card-icon icon-green-gradient">🤖</div>
              <h4 className="feature-card-title">AI-Powered Insights</h4>
              <p className="feature-card-desc">Intelligent recommendations powered by Google Gemini technology</p>
            </div>
          
          </div>

          {/* Benefits Section */}
          <div className="benefits-section">
            <div className="benefits-decoration"></div>
            <div className="benefits-content">
              <h3 className="benefits-title">Built for Modern Farmers</h3>
              <div className="benefits-stats">
                <div className="benefit-stat">
                  <div className="benefit-number">10x</div>
                  <div className="benefit-label">Faster Decision Making</div>
                </div>
                
                <div className="benefit-stat">
                  <div className="benefit-number">24/7</div>
                  <div className="benefit-label">Support & Monitoring</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <h3 className="cta-title">Ready to Transform Your Farm?</h3>
            <p className="cta-text">
              Join thousands of farmers already using FarmVista to increase yields and make smarter farming decisions.
            </p>
            <Link to="/register" className="btn btn-cta">
              Start Your Free Trial →
            </Link>
          </div>
        </main>
      )}
    </div>
  );
};

export default Home;