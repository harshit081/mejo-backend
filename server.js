const app = require('./app');
const { sequelize } = require('./config/db');
const { connectMongo } = require('./config/mongodb');
require('dotenv').config();

const config = require('./config/config');
const PORT = config.port || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectMongo();
        console.log('MongoDB connected successfully');

        // Sync PostgreSQL with force:true to create tables
        await sequelize.sync({ alter: true });
        console.log('PostgreSQL tables created successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
