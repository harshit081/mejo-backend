const app = require('./app');
const { sequelize } = require('./config/db');
const { connectMongo } = require('./config/mongodb');
require('dotenv').config();

const config = require('./config/config');
const PORT = config.port || 5000;

// Initialize database connections on cold start
let mongoConnected = false;
let postgresConnected = false;

const initDatabases = async () => {
  if (!mongoConnected) {
    try {
      await connectMongo();
      mongoConnected = true;
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }
  
  if (!postgresConnected) {
    try {
      await sequelize.authenticate();
      postgresConnected = true;
      console.log('PostgreSQL connection established successfully.');
    } catch (error) {
      console.error('PostgreSQL connection error:', error);
    }
  }
};

// Initialize databases on cold start
initDatabases();

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express API for Vercel
module.exports = app;
