import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const WhisperAPI = {
  // Get all whispers, optionally filtered by vibe
  getWhispers: async (vibe = '') => {
    try {
      const url = vibe ? `/whispers?vibe=${vibe}` : '/whispers';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching whispers:', error);
      throw error;
    }
  },
  
  // Get a single whisper with its details
  getWhisper: async (id) => {
    try {
      const response = await api.get(`/whispers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching whisper:', error);
      throw error;
    }
  },
  
  // Create a new whisper
  createWhisper: async (text, vibeTags = []) => {
    try {
      const response = await api.post('/whispers', { text, vibeTags });
      return response.data;
    } catch (error) {
      console.error('Error creating whisper:', error);
      throw error;
    }
  },
  
  // Reply to a whisper
  replyToWhisper: async (whisperId, text, vibeTags = []) => {
    try {
      const response = await api.post(`/whispers/${whisperId}/reply`, { text, vibeTags });
      return response.data;
    } catch (error) {
      console.error('Error replying to whisper:', error);
      throw error;
    }
  }
};

export const VibeAPI = {
  // Get all vibes
  getVibes: async () => {
    try {
      const response = await api.get('/vibes');
      return response.data;
    } catch (error) {
      console.error('Error fetching vibes:', error);
      throw error;
    }
  },
  
  // Create a new vibe
  createVibe: async (name, description = '', color = '') => {
    try {
      const response = await api.post('/vibes', { name, description, color });
      return response.data;
    } catch (error) {
      console.error('Error creating vibe:', error);
      throw error;
    }
  }
};

export default { WhisperAPI, VibeAPI }; 