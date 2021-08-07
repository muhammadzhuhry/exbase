const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'module user 🌏'
  });
});

router.get('/listuser', (req, res) => {
  res.json({
    message: 'list user 🌏'
  });
});

module.exports = router;