const express = require('express');
const commandsDomain = require('../repositories/commands/domain');
const queriesDomain = require('../repositories/queries/domain');
const validator = require('../utils/validator');
const wrapper = require('../../../helpers/utils/wrapper');
const { SUCCESS:http } = require('../../../helpers/http-status/status-code');

const router = express.Router();

// QUERIES

// handler get one book
router.get('/:id', async (req, res) => {
  const bookId = req.params.id;

  const getOneBook = async () => queriesDomain.getOneBook(bookId);
  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.response(res, 'success', result, `success get book with id ${bookId}`, http.OK);
  };
  sendResponse(await getOneBook());
});

// handler get list book
router.get('/', async (req, res) => {
  const payload = { ...req.query };

  const getUsers = async () => queriesDomain.getBooks(payload);
  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, 'success get list book', http.OK);
  };
  sendResponse(await getUsers());
});

// COMMANDS

// handler insert book
router.post('/', async (req, res) => {
  const payload = { ...req.body };

  const validatePayload = await validator.validateInsertBook(payload);
  const postBook = async (result) => {
    if (result.error) {
      return result;
    }
    return await commandsDomain.insertBook(payload);
  };

  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, 'success insert book', http.CREATED);
  };
  sendResponse(await postBook(validatePayload));
});

module.exports = router;
