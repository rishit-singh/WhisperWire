import axios from 'axios';

// In production, we'll use the REACT_APP_API_URL environment variable
// In development, we'll use localhost:5002
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api/v1';

console.log('API URL:', API_URL); // For debugging

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
  },
  
  // Delete a whisper
  deleteWhisper: async (whisperId) => {
    try {
      console.log(`Making DELETE request to: ${API_URL}/whispers/${whisperId}`);
      const response = await api.delete(`/whispers/${whisperId}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting whisper:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
      }
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

// Create a named export for the combined APIs
const APIs = { WhisperAPI, VibeAPI };

// Export the combined APIs as default
export default APIs; 