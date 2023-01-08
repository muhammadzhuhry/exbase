const express = require('express');
const jwtAuth = require('../../auth/jwt_auth_helper');
const basicAuth = require('../../auth/basic_auth_helper');
const userHandler = require('../../modules/user/handlers/api_handler');

const router = express.Router();

router.get('/root', basicAuth.isAuthenticated, userHandler.root);
router.get('/', basicAuth.isAuthenticated, userHandler.getUsers);
router.get('/:email', jwtAuth.verifyToken, userHandler.getOneUser);
router.post('/register', basicAuth.isAuthenticated, userHandler.registerUser);
router.put('/update/:id', basicAuth.isAuthenticated, userHandler.updateUser);
router.post('/login', basicAuth.isAuthenticated, userHandler.loginUser);

module.exports = router;
