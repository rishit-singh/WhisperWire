require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');
const Whisper = require('./models/Whisper');
const Vibe = require('./models/Vibe');
const { defaultVibes } = require('./seedData');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Connected to MongoDB');
  // Initialize default vibes if none exist
  initializeVibes();
})
.catch(err => console.error('MongoDB connection error:', err));

// Initialize default vibes if none exist
const initializeVibes = async () => {
  try {
    const vibesCount = await Vibe.countDocuments();
    if (vibesCount === 0) {
      console.log('No vibes found. Creating default vibes...');
      await Vibe.insertMany(defaultVibes);
      console.log('Default vibes created successfully!');
    }
  } catch (error) {
    console.error('Error initializing vibes:', error);
  }
};

// Routes
// Get all whispers with optional vibe filter
app.get('/api/v1/whispers', async (req, res) => {
  try {
    const { vibe } = req.query;
    const filter = vibe ? { vibeTags: vibe } : {};
    const whispers = await Whisper.find(filter)
      .populate('replies')
      .sort({ timestamp: -1 });
    res.json(whispers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch whispers' });
  }
});

// Create a new whisper
app.post('/api/v1/whispers', async (req, res) => {
  try {
    const { text, vibeTags } = req.body;
    const whisper = new Whisper({ text, vibeTags });
    await whisper.save();
    
    // Update vibe counts
    if (vibeTags && vibeTags.length > 0) {
      await Vibe.updateMany(
        { name: { $in: vibeTags } },
        { $inc: { whisperCount: 1 } }
      );
    }
    
    res.status(201).json(whisper);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create whisper' });
  }
});

// Get all vibes
app.get('/api/v1/vibes', async (req, res) => {
  try {
    const vibes = await Vibe.find().sort({ whisperCount: -1 });
    res.json(vibes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vibes' });
  }
});

// Create a new vibe
app.post('/api/v1/vibes', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const vibe = new Vibe({ name, description, color });
    await vibe.save();
    res.status(201).json(vibe);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create vibe' });
  }
});

// Reply to a whisper
app.post('/api/v1/whispers/:id/reply', async (req, res) => {
  try {
    const { text, vibeTags } = req.body;
    const parentWhisper = await Whisper.findById(req.params.id);
    
    if (!parentWhisper) {
      return res.status(404).json({ error: 'Whisper not found' });
    }

    const reply = new Whisper({ text, vibeTags });
    await reply.save();
    
    parentWhisper.replies.push(reply._id);
    parentWhisper.replyCount += 1;
    await parentWhisper.save();
    
    res.status(201).json(reply);
  } catch (error) {
    res.status(400).json({ error: 'Failed to post reply' });
  }
});

// Simple DELETE endpoint for testing
app.delete('/api/v1/whispers/:id', async (req, res) => {
  try {
    const whisper = await Whisper.findByIdAndDelete(req.params.id);
    if (!whisper) {
      return res.status(404).json({ error: 'Whisper not found' });
    }
    res.status(200).json({ message: 'Whisper deleted successfully' });
  } catch (error) {
    console.error('Error deleting whisper:', error);
    res.status(500).json({ error: 'Failed to delete whisper' });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 