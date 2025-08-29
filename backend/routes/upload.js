const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Mock file upload', filename: 'mock-file.jpg' });
});

module.exports = router;
