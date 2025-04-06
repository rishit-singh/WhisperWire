import React, { useEffect, useState } from 'react';
import WhisperCard from './WhisperCard';
import { WhisperAPI } from '../../api';
import './WhisperList.css';

const WhisperList = ({ whispers, onReply, onDelete, loading }) => {
  const [processedWhispers, setProcessedWhispers] = useState([]);

  // Process whispers to handle any replies that might appear at the top level
  useEffect(() => {
    const processWhispers = async () => {
      // For top-level whispers, we use them as-is
      // For any replies that somehow appear at the top level, we fetch their parent
      if (!whispers || whispers.length === 0) return;

      const processed = await Promise.all(
        whispers.map(async (whisper) => {
          // If it's a reply and doesn't have the parentWhisper populated
          if (whisper.isReply && whisper.parentWhisper && 
              (typeof whisper.parentWhisper === 'string' || !whisper.parentWhisper.text)) {
            try {
              const parentWhisper = await WhisperAPI.getWhisper(whisper.parentWhisper);
              return { ...whisper, parentWhisper };
            } catch (error) {
              console.error('Error fetching parent whisper:', error);
              return whisper;
            }
          }
          return whisper;
        })
      );

      setProcessedWhispers(processed);
    };

    processWhispers();
  }, [whispers]);

  if (loading) {
    return (
      <div className="whisper-list-loading">
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading whispers...</p>
        </div>
      </div>
    );
  }

  if (!processedWhispers || processedWhispers.length === 0) {
    return (
      <div className="whisper-list-empty">
        <p>No whispers found. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="whisper-list">
      {processedWhispers.map((whisper, index) => (
        <WhisperCard 
          key={whisper._id || `whisper-${index}`} 
          whisper={whisper} 
          onReply={onReply} 
          onDelete={onDelete}
          isReply={whisper.isReply}
          parentWhisper={whisper.parentWhisper}
        />
      ))}
    </div>
  );
};

export default WhisperList; 