const express = require('express');
const userV1 = require('./v1/user');
const bookV1 = require('./v1/book');

const router = express.Router();

// api/v1/
router.use('/v1/user', userV1);
router.use('/v1/book', bookV1);

module.exports = router;
