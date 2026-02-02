import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    region: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Check password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      setPasswordStrength({ level: 'weak', text: 'Weak password', color: '#ef4444' });
    } else if (strength <= 3) {
      setPasswordStrength({ level: 'medium', text: 'Medium password', color: '#f59e0b' });
    } else {
      setPasswordStrength({ level: 'strong', text: 'Strong password', color: '#22c55e' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Background Elements */}
      <div className="register-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-grid"></div>
      </div>

      {/* Main Content */}
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="logo-container">
            <span className="logo-text">FarmVista</span>
          </div>
          <h2 className="register-title">Create Your Account</h2>
          <p className="register-subtitle">
            Join thousands of farmers making smarter decisions
          </p>
        </div>

        {/* Form Container */}
        <div className="form-container">
          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              <div className="error-icon">
                <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="error-content">
                <p className="error-text">{error}</p>
              </div>
            </div>
          )}

          {/* Register Form */}
          <form className="register-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="farmer@example.com"
                className="form-input"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                className="form-input"
                minLength="6"
              />
              
              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-fill ${passwordStrength.level}`}
                    ></div>
                  </div>
                  <p className="strength-text" style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </p>
                </div>
              )}
              <p className="helper-text">Minimum 6 characters recommended</p>
            </div>

            {/* Region */}
            <div className="form-group">
              <label htmlFor="region" className="form-label">
                Region <span className="optional-badge">Optional</span>
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="e.g., Punjab, Maharashtra"
                className="form-input"
              />
              <p className="helper-text">Helps us provide region-specific advice</p>
            </div>

            {/* Submit Button */}
            <div className="form-submit">
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="arrow-icon">→</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="login-link">
            <p className="login-text">
              Already have an account?{' '}
              <Link to="/login" className="login-cta">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
