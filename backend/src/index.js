require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const proxyRoutes = require('./routes/proxy');
const authenticate = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Global middleware
app.use(cors());
app.use(express.json());

// Public routes — no authentication required
app.use('/auth', authRoutes);

// Protected routes — valid JWT required
app.use('/api/trips', authenticate, tripRoutes);

// Internal proxy — forwards to microservices (authenticated)
app.use('/api/proxy', authenticate, proxyRoutes);

// Health check (public)
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API Gateway is running' });
});

// Global error handler — must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Gateway listening on http://localhost:${PORT}`);
});

module.exports = app;
