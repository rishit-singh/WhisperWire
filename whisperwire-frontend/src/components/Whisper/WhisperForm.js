import React, { useState } from 'react';
import './WhisperForm.css';

const VIBE_OPTIONS = [
  'Chaotic', 'Chill', 'Excited', 'Pensive', 'Unhinged', 'Sentimental'
];

const WhisperForm = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState('');
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [error, setError] = useState('');
  
  const handleVibeToggle = (vibe) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Whisper cannot be empty');
      return;
    }
    
    if (text.length > 280) {
      setError('Whisper must be 280 characters or less');
      return;
    }
    
    onSubmit(text, selectedVibes);
    setText('');
    setSelectedVibes([]);
    setError('');
  };
  
  return (
    <div className="whisper-form-container">
      <h3>Create a New Whisper</h3>
      <form onSubmit={handleSubmit} className="whisper-form">
        <textarea
          className="whisper-input"
          placeholder="What's on your mind? Share anonymously..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={280}
          autoFocus
        />
        
        <div className="character-count">
          <span className={text.length > 280 ? 'over-limit' : ''}>
            {text.length}/280
          </span>
        </div>
        
        <div className="vibe-selection">
          <p className="vibe-selection-label">Choose your vibes:</p>
          <div className="vibe-options">
            {VIBE_OPTIONS.map(vibe => (
              <button
                type="button"
                key={vibe}
                className={`vibe-option ${selectedVibes.includes(vibe) ? 'selected' : ''}`}
                onClick={() => handleVibeToggle(vibe)}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="whisper-form-actions">
          <button type="button" className="cancel-whisper" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-whisper">
            Share Whisper
          </button>
        </div>
      </form>
    </div>
  );
};

export default WhisperForm; 