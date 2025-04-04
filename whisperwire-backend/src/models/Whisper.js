const mongoose = require('mongoose');

const WhisperSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true,
    maxLength: 280 // Twitter-like character limit
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  sentiment: String,
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Whisper' 
  }],
  vibeTags: [String],
  replyCount: {
    type: Number,
    default: 0
  },
  isReply: {
    type: Boolean,
    default: false
  },
  parentWhisper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Whisper',
    default: null
  }
});

module.exports = mongoose.model('Whisper', WhisperSchema); 