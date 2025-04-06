require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const Whisper = require('./models/Whisper');
const Vibe = require('./models/Vibe');
const { defaultVibes } = require('./seedData');

const app = express();

// CORS configuration for deployment
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
.then(() => {
  console.log('Connected to MongoDB');
  // Initialize default vibes if none exist
  initializeVibes();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

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
    
    // Build filter based on vibe and non-reply status
    const filter = { 
      isReply: false // Only get root whispers, not replies
    };
    
    // Add vibe filter if provided
    if (vibe) {
      filter.vibeTags = vibe;
    }
    
    const whispers = await Whisper.find(filter)
      .populate({
        path: 'replies',
        options: { sort: { timestamp: 1 } } // Sort replies by timestamp ascending
      })
      .sort({ timestamp: -1 });
    
    res.json(whispers);
  } catch (error) {
    console.error('Error fetching whispers:', error);
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

    const reply = new Whisper({ 
      text, 
      vibeTags,
      isReply: true,
      parentWhisper: parentWhisper._id
    });
    
    await reply.save();
    
    parentWhisper.replies.push(reply._id);
    parentWhisper.replyCount += 1;
    await parentWhisper.save();
    
    res.status(201).json(reply);
  } catch (error) {
    console.error('Error replying to whisper:', error);
    res.status(400).json({ error: 'Failed to post reply' });
  }
});

// Get a single whisper with its replies
app.get('/api/v1/whispers/:id', async (req, res) => {
  try {
    const whisper = await Whisper.findById(req.params.id)
      .populate({
        path: 'replies',
        options: { sort: { timestamp: 1 } } // Sort replies by timestamp ascending
      });
    
    if (!whisper) {
      return res.status(404).json({ error: 'Whisper not found' });
    }
    
    res.json(whisper);
  } catch (error) {
    console.error('Error fetching whisper:', error);
    res.status(500).json({ error: 'Failed to fetch whisper' });
  }
});

// Delete a whisper
app.delete('/api/v1/whispers/:id', async (req, res) => {
  try {
    console.log(`Attempting to delete whisper with ID: ${req.params.id}`);
    
    // Validate that the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log(`Invalid ObjectId format: ${req.params.id}`);
      return res.status(400).json({ error: 'Invalid whisper ID format' });
    }
    
    const whisper = await Whisper.findById(req.params.id);
    
    if (!whisper) {
      console.log(`Whisper not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Whisper not found' });
    }
    
    console.log(`Found whisper: ${whisper._id}, isReply: ${whisper.isReply}`);
    
    // If this is a reply, update the parent whisper
    if (whisper.isReply && whisper.parentWhisper) {
      console.log(`Updating parent whisper: ${whisper.parentWhisper}`);
      const parentWhisper = await Whisper.findById(whisper.parentWhisper);
      if (parentWhisper) {
        // Remove this reply from parent's replies array
        parentWhisper.replies = parentWhisper.replies.filter(
          replyId => replyId.toString() !== whisper._id.toString()
        );
        // Decrement reply count
        parentWhisper.replyCount = Math.max(0, parentWhisper.replyCount - 1);
        await parentWhisper.save();
        console.log(`Updated parent whisper, new reply count: ${parentWhisper.replyCount}`);
      } else {
        console.log(`Parent whisper not found: ${whisper.parentWhisper}`);
      }
    }
    
    // If this is a parent whisper, delete all its replies
    if (whisper.replies && whisper.replies.length > 0) {
      console.log(`Deleting ${whisper.replies.length} replies`);
      const deleteResult = await Whisper.deleteMany({ _id: { $in: whisper.replies } });
      console.log(`Deleted ${deleteResult.deletedCount} replies`);
    }
    
    // Delete the whisper itself
    const result = await Whisper.findByIdAndDelete(req.params.id);
    console.log(`Deleted whisper result:`, result ? 'Success' : 'Failed');
    
    res.status(200).json({ message: 'Whisper deleted successfully' });
  } catch (error) {
    console.error('Error deleting whisper:', error);
    res.status(500).json({ error: 'Failed to delete whisper', details: error.message });
  }
});

// Add a simple root route for health check
app.get('/', (req, res) => {
  res.json({ message: 'WhisperWire API is running' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 