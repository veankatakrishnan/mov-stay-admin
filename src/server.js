require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/admin/analytics', analyticsRoutes);
app.use('/admin/data', dataRoutes);

// Optional: A simple health check route
app.get('/', (req, res) => res.send('MOV Stay Admin Analytics API Running'));

// Database test route
app.get('/admin/test-db', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ status: "disconnected", collections: [] });
    }
    
    // Fetch collections from the connected database
    const collectionsRaw = await mongoose.connection.db.listCollections().toArray();
    const collections = collectionsRaw.map(col => col.name);
    
    res.json({
      status: "connected",
      collections: collections
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mov_stay';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB Atlas');
    
    app.listen(PORT, () => {
      console.log(`Admin Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

// Start Server
connectDB();
