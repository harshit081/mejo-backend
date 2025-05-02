require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/db');
const { connectMongo } = require('./config/mongodb');

const PORT = process.env.PORT || 5000; // Glitch often uses port 3000

// Simple startup sequence
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongo();
    console.log('MongoDB connected successfully');
    
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
