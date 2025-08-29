const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Mock login', token: 'mock-jwt-token' });
});

router.post('/register', (req, res) => {
  res.json({ success: true, message: 'Mock registration' });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;
