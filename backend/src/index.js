require('dotenv').config();
const express = require('express');
const cors = require('cors');

const tripRoutes = require('./routes/trips');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Stub routes — Phase 1
app.use('/api/trips', tripRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API Gateway is running' });
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on http://localhost:${PORT}`);
});

module.exports = app;
