import React, { useState, useEffect } from 'react';
import Header from '../components/Common/Header';
import VibeFilter from '../components/Vibe/VibeFilter';
import WhisperList from '../components/Whisper/WhisperList';
import WhisperForm from '../components/Whisper/WhisperForm';
import { WhisperAPI, VibeAPI } from '../api';
import './Home.css';

const Home = () => {
  const [whispers, setWhispers] = useState([]);
  const [vibes, setVibes] = useState([]);
  const [selectedVibe, setSelectedVibe] = useState('');
  const [loading, setLoading] = useState(true);
  const [showWhisperForm, setShowWhisperForm] = useState(false);
  const [error, setError] = useState('');

  // Fetch whispers and vibes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch whispers with optional vibe filter
        const whispersData = await WhisperAPI.getWhispers(selectedVibe);
        setWhispers(whispersData);
        
        // Only fetch vibes once
        if (vibes.length === 0) {
          const vibesData = await VibeAPI.getVibes();
          setVibes(vibesData);
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedVibe]);

  // Handle create whisper
  const handleCreateWhisper = async (text, vibeTags) => {
    try {
      setLoading(true);
      await WhisperAPI.createWhisper(text, vibeTags);
      
      // Refresh whispers after creating a new one
      const updatedWhispers = await WhisperAPI.getWhispers(selectedVibe);
      setWhispers(updatedWhispers);
      
      setShowWhisperForm(false);
      setError('');
    } catch (err) {
      console.error('Error creating whisper:', err);
      setError('Failed to create whisper. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle reply to whisper
  const handleReply = async (whisperId, text, vibeTags) => {
    try {
      setLoading(true);
      await WhisperAPI.replyToWhisper(whisperId, text, vibeTags);
      
      // Refresh whispers after replying
      const updatedWhispers = await WhisperAPI.getWhispers(selectedVibe);
      setWhispers(updatedWhispers);
      
      setError('');
    } catch (err) {
      console.error('Error replying to whisper:', err);
      setError('Failed to reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle header button click
  const handleHeaderButtonClick = () => {
    setShowWhisperForm(true);
  };

  return (
    <div className="home">
      <Header onNewWhisperClick={handleHeaderButtonClick} />
      
      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error-banner">
              <p>{error}</p>
              <button onClick={() => setError('')}>Dismiss</button>
            </div>
          )}
          
          {showWhisperForm && (
            <WhisperForm 
              onSubmit={handleCreateWhisper} 
              onCancel={() => setShowWhisperForm(false)} 
            />
          )}
          
          <VibeFilter 
            vibes={vibes} 
            selectedVibe={selectedVibe} 
            onVibeChange={setSelectedVibe} 
          />
          
          <WhisperList 
            whispers={whispers} 
            onReply={handleReply} 
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default Home; 