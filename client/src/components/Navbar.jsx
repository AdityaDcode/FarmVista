import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';
    
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/logo.svg" alt="FarmVista Logo" className="brand-logo" />
          <span className="brand-text">FarmVistaa</span>
        </Link>

        <button 
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="navbar-toggle-icon"></span>
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/add-farm" className="nav-link">Add Farm</Link>
              <Link to="/advice" className="nav-link">Advice</Link>
              <span className="nav-user">
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-nav btn-nav-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
