import React from 'react';
import './VibeFilter.css';

const VibeFilter = ({ vibes, selectedVibe, onVibeChange }) => {
  return (
    <div className="vibe-filter">
      <div className="vibe-filter-title">Filter by Vibe</div>
      <div className="vibe-chips">
        <button 
          className={`vibe-chip ${!selectedVibe ? 'active' : ''}`}
          onClick={() => onVibeChange('')}
        >
          All
        </button>
        {vibes.map((vibe) => (
          <button 
            key={vibe._id} 
            className={`vibe-chip ${selectedVibe === vibe.name ? 'active' : ''}`}
            style={{ 
              '--vibe-color': vibe.color || 'var(--primary-color)'
            }} 
            onClick={() => onVibeChange(vibe.name)}
          >
            {vibe.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VibeFilter; 