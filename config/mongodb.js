const mongoose = require('mongoose');
const config = require('./config');

// Simple MongoDB connection
const connectMongo = async () => {
  if (!config.mongodb || !config.mongodb.uri) {
    console.warn('MongoDB URI not provided');
    return;
  }

  try {
    await mongoose.connect(config.mongodb.uri, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1)
    throw error; // Let the caller handle this error
  }
};

module.exports = { connectMongo };