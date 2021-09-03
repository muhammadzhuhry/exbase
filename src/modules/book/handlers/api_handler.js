const express = require('express');
const commandsDomain = require('../repositories/commands/domain');
const validator = require('../utils/validator');
const wrapper = require('../../../helpers/utils/wrapper');
const { SUCCESS:http } = require('../../../helpers/http-status/status-code');

const router = express.Router();

// QUERIES

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
