import React, { useState } from 'react';
import './ReplyForm.css';

const VIBE_OPTIONS = [
  'Chaotic', 'Chill', 'Excited', 'Pensive', 'Unhinged', 'Sentimental'
];

const ReplyForm = ({ onSubmit }) => {
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
      setError('Reply cannot be empty');
      return;
    }
    
    if (text.length > 280) {
      setError('Reply must be 280 characters or less');
      return;
    }
    
    onSubmit(text, selectedVibes);
    setText('');
    setSelectedVibes([]);
    setError('');
  };
  
  return (
    <div className="reply-form-container">
      <form onSubmit={handleSubmit} className="reply-form">
        <textarea
          className="reply-input"
          placeholder="Share your one-time reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={280}
        />
        
        <div className="character-count">
          <span className={text.length > 280 ? 'over-limit' : ''}>
            {text.length}/280
          </span>
        </div>
        
        <div className="vibe-selection">
          <p className="vibe-selection-label">Choose your vibe (optional):</p>
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
        
        <div className="reply-form-actions">
          <button type="submit" className="submit-reply">
            Submit Reply
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm; 