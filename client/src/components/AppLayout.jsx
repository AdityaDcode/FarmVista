import React from 'react';
import Navbar from './Navbar';
import '../styles/app-layout.css';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}
