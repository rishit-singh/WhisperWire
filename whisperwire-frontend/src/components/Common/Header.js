import React from 'react';
import './Header.css';

const Header = ({ onNewWhisperClick }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>WhisperWire</h1>
            <p className="tagline">Share your thoughts, vibe by vibe</p>
          </div>
          <div className="header-actions">
            <button 
              className="create-whisper-btn"
              onClick={onNewWhisperClick}
            >
              New Whisper
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 