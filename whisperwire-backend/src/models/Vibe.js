const mongoose = require('mongoose');

const VibeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  description: String,
  color: {
    type: String,
    default: '#000000'
  },
  whisperCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Vibe', VibeSchema); 