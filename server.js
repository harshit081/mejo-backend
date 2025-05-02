console.log('Starting server...');
console.log('Node environment:', process.env.NODE_ENV);
console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
console.log('PostgreSQL connection string exists:', !!process.env.POSTGRES_SUPABASE_CONNECT_URL);

const app = require('./app');
const { sequelize } = require('./config/db');
const { connectMongo } = require('./config/mongodb');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Flag to track database connection attempts
let mongoAttempted = false;
let postgresAttempted = false;

const initDatabases = async (req, res, next) => {
  try {
    // Only attempt Mongo connection once
    if (!mongoAttempted) {
      mongoAttempted = true;
      try {
        await connectMongo();
        console.log('MongoDB connected');
      } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Continue even if MongoDB fails
      }
    }
    
    // Only attempt Postgres connection once
    if (!postgresAttempted) {
      postgresAttempted = true;
      try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected');
      } catch (error) {
        console.error('PostgreSQL connection error:', error.message);
        // Continue even if PostgreSQL fails
      }
    }
    
    // Always proceed to the next middleware
    if (next) next();
  } catch (error) {
    console.error('Database initialization error:', error);
    if (next) next(error);
  }
};

// Initialize databases on startup, but don't block the app from starting
initDatabases().catch(err => {
  console.error('Failed to initialize databases:', err);
});

// Add middleware to ensure DB connection attempt before handling requests
app.use((req, res, next) => {
  initDatabases(req, res, next);
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express API for Vercel
module.exports = app;
