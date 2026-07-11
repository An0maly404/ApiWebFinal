const express = require('express');
const router = express.Router();
const trips = require('../mocks/trips.json');

// GET /api/trips - Return all mock trips
router.get('/', (req, res) => {
  res.json(trips);
});

// POST /api/trips - Echo back the posted trip data (stub)
router.post('/', (req, res) => {
  const newTrip = req.body;
  res.status(201).json({
    message: 'Trip received (stub — will be persisted in Phase 2)',
    trip: newTrip
  });
});

module.exports = router;
