const express = require('express');
const userHandler = require('../modules/user/handlers/api_handler');

const router = express.Router();

// module user
router.use('/user', userHandler);

module.exports = router;