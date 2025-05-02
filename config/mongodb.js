const mongoose = require('mongoose');
const config = require('./config');

// Track connection status
let isConnected = false;

const connectMongo = async () => {
  // Skip if already connected
  if (isConnected) {
    return Promise.resolve();
  }
  
  // Skip if no URI is provided
  if (!config.mongodb || !config.mongodb.uri) {
    console.warn('MongoDB URI not provided, skipping connection');
    return Promise.resolve();
  }
  
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(config.mongodb.uri, options);
    isConnected = true;
    return Promise.resolve();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Don't reject the promise, let the app continue
    return Promise.resolve();
  }
};

module.exports = { connectMongo };