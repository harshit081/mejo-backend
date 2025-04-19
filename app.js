const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const authRoutes = require('./routes/authRoutes');
const userTextRoutes = require('./routes/userTextRoutes'); // Assuming you have userTextRoutes defined
const profileRoutes = require('./routes/profileRoutes');
const { sequelize } = require('./config/db');
const Users = require('./models/postgres/Users');
const OTP = require('./models/postgres/OTP');
const Token = require('./models/postgres/Token');
const PasswordReset = require('./models/postgres/PasswordReset');

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
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json()); // Parse incoming JSON requests

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/usertext', userTextRoutes); // Assuming you have userTextRoutes defined
app.use('/api/profile', profileRoutes);
app.get('/test', (req, res) => {
    res.send("hello");
});

module.exports = app;
