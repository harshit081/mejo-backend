const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userTextRoutes = require('./routes/userTextRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// CORS configuration with environment-specific origins
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.vercel.app'] // Update with your frontend URL
      : "http://localhost:3000",
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

// Health check route for Vercel
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;
