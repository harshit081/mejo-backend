const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userTextRoutes = require('./routes/userTextRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://mejo.vercel.app', 
    'https://mejo-frontend.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/usertext', userTextRoutes);
app.use('/api/profile', profileRoutes);

// Health check and root routes
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.status(200).send('Mejo API is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Server error', 
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message 
  });
});

module.exports = app;
