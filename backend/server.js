const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:5174',
    ];
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in dev
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/contractors', require('./routes/contractors'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Buildease API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
