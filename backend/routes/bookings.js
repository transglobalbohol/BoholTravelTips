const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'Mock bookings endpoint' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Booking created' });
});

module.exports = router;
