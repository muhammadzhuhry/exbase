const express = require('express');
const basicAuth = require('../../auth/basic_auth_helper');
const userHandler = require('../../modules/user/handlers/api_handler');

const router = express.Router();

router.get('/root', basicAuth.isAuthenticated, userHandler.root);
router.get('/', basicAuth.isAuthenticated, userHandler.getUsers);
router.get('/:id', basicAuth.isAuthenticated, userHandler.getOneUser);
router.post('/', basicAuth.isAuthenticated, userHandler.insertUser);
router.put('/:id', basicAuth.isAuthenticated, userHandler.updateUser);

module.exports = router;
