import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddFarm from './pages/AddFarm';
import FarmDetail from './pages/FarmDetail';
import AllAdvice from './pages/AllAdvice';

import './index.css';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// Public Route component
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// 404 Page
const NotFound = () => (
  <div className="not-found">
    <div className="not-found-content">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <a href="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/add-farm"
            element={
              <ProtectedRoute>
                <AddFarm />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/farm/:farmId"
            element={
              <ProtectedRoute>
                <FarmDetail />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/edit-farm/:farmId"
            element={
              <ProtectedRoute>
                <AddFarm />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/advice"
            element={
              <ProtectedRoute>
                <AllAdvice />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
