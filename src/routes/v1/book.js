const express = require('express');
const basicAuth = require('../../auth/basic_auth_helper');
const bookHandler = require('../../modules/book/handlers/api_handler');

const router = express.Router();

router.get('/root', basicAuth.isAuthenticated, bookHandler.root);
router.get('/', basicAuth.isAuthenticated, bookHandler.getBooks);
router.get('/:id', basicAuth.isAuthenticated, bookHandler.getOneBook);
router.post('/', basicAuth.isAuthenticated, bookHandler.insertBook);
router.put('/:id', basicAuth.isAuthenticated, bookHandler.updateBook);

module.exports = router;
