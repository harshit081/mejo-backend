const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userTextRoutes = require('./routes/userTextRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// CORS configuration with multiple allowed origins
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://mejo.vercel.app', 
      'https://mejo-frontend.vercel.app',
      'http://localhost:3000'  // Allow local development
    ];
    
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
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

// Health check and root routes
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.status(200).send('Mejo API is running');
});

module.exports = app;
