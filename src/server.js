require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/admin/analytics', analyticsRoutes);

// Optional: A simple health check route
app.get('/', (req, res) => res.send('MOV Stay Admin Analytics API Running'));

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mov_stay';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Admin Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
