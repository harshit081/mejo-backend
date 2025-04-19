const app = require('./app');
const { sequelize } = require('./config/db');
const { connectMongo } = require('./config/mongodb');
require('dotenv').config();

const config = require('./config/config');
const PORT = config.port || 5000;

// Connect to both databases with force sync for PostgreSQL
Promise.all([
    sequelize.sync({ force: true }), // This will drop and recreate all tables
    connectMongo()
]).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error during initialization:', error);
    process.exit(1);
});
