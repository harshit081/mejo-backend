const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userTextRoutes = require('./routes/userTextRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { sequelize } = require('./config/db');

const app = express();

// CORS configuration
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/usertext', userTextRoutes);
app.use('/api/profile', profileRoutes);

module.exports = app;
