const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const authRoutes = require('./routes/authRoutes');
const { sequelize } = require('./config/db');
const Users = require('./models/Users');
const OTP = require('./models/OTP');
const Token = require('./models/Token');
const PasswordReset = require('./models/PasswordReset');

(async () => {
    try {
        // Synchronize all models
        await sequelize.sync({ force: false, alter: true }); 
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to sync the database:", error);
    }
})();

const app = express();

// ✅ Enable CORS for frontend requests
const corsOptions = {
    origin: ["http://localhost:3000"], // Change this to your frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies & authentication headers
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests

// ✅ Routes
app.use('/api/auth', authRoutes);
app.get('/test', (req, res) => {
    res.send("hello");
});

module.exports = app;
