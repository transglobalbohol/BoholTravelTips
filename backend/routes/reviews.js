const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'Mock reviews endpoint' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Review created' });
});

module.exports = router;
