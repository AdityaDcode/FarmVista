require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const adviceRoutes = require('./routes/adviceRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/advice', adviceRoutes);

//For docker project


app.get('/api/kill', (req, res) => {
  res.send('Simulating crash');
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

let isAlive = true;

app.get('/api/health', (req, res) => {
  if (!isAlive) {
    return res.status(500).json({ status: 'DOWN' });
  }
  res.json({ status: 'UP UP' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: error.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  isAlive = true;
  console.log(`\n🚀 FarmVista Backend running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}\n`);
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware (MUST have 4 arguments)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
  });
});
