const express = require('express');
const userHandler = require('../modules/user/handlers/api_handler');
const bookHandler = require('../modules/book/handlers/api_handler');

const router = express.Router();

// module user
router.use('/user', userHandler);

// module book
router.use('/book', bookHandler);

module.exports = router;
