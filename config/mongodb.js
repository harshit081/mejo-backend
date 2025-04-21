const mongoose = require('mongoose');
const config = require('./config');

const connectMongo = async () => {
    try {
        await mongoose.connect(config.mongodb.uri, {
            // Remove deprecated options
            // useNewUrlParser and useUnifiedTopology are no longer needed
        });
        console.log('MongoDB connection established successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = { connectMongo };