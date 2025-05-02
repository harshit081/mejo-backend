const mongoose = require('mongoose');
const config = require('./config');

// Track connection status
let isConnected = false;

const connectMongo = async () => {
  // Don't reconnect if already connected
  if (isConnected) {
    return;
  }
  
  try {
    const db = await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 10000 // Timeout after 10s instead of 30s
    });
    isConnected = true;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = { connectMongo };