const express = require('express');
const router = express.Router();

const ITINERARY_SERVICE_URL = 'http://localhost:5001';

// GET /api/trips - Fetch the authenticated user's trips from the itinerary service
router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${ITINERARY_SERVICE_URL}/trips/${req.user.googleId}`);

    if (!response.ok) {
      return res.status(502).json({ error: 'Bad Gateway', message: 'Itinerary service returned an error' });
    }

    const trips = await response.json();
    res.json(trips);
  } catch (err) {
    res.status(502).json({ error: 'Bad Gateway', message: 'Itinerary service is unreachable' });
  }
});

// POST /api/trips - Create a trip via the itinerary service
router.post('/', async (req, res) => {
  try {
    const response = await fetch(`${ITINERARY_SERVICE_URL}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req.body, userId: req.user.googleId }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Bad Gateway', message: 'Itinerary service is unreachable' });
  }
});

module.exports = router;
