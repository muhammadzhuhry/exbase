const commandsDomain = require('../repositories/commands/domain');
const queriesDomain = require('../repositories/queries/domain');
const validator = require('../utils/validator');
const wrapper = require('../../../helpers/utils/wrapper');
const { SUCCESS:http } = require('../../../helpers/http-status/status-code');

const root = async (req, res) => {
  wrapper.response(res, 'success', wrapper.data('api_handler book'), 'root of book');
};

// QUERIES

// handler get list book
const getBooks = async (req, res) => {
  const payload = { ...req.query };

  const getData = async () => queriesDomain.getBooks(payload);
  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, 'success get list book', http.OK);
  };
  sendResponse(await getData());
};

// handler get one book
const getOneBook = async (req, res) => {
  const bookId = req.params.id;

  const getData = async () => queriesDomain.getOneBook(bookId);
  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.response(res, 'success', result, `success get book with id ${bookId}`, http.OK);
  };
  sendResponse(await getData());
};

// COMMANDS

// handler insert book
const insertBook = async (req, res) => {
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
};

// hander update book
const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const payload = { ...req.body };
  const schema = {
    ...req.params,
    ...req.body
  };

  const validatePayload = await validator.validateUpdateBook(schema);
  const putBook = async (result) => {
    if (result.error) {
      return result;
    }
    return await commandsDomain.updateBook(bookId, payload);
  };

  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, `success update book with id ${bookId}`, http.OK);
  };
  sendResponse(await putBook(validatePayload));
};

module.exports = {
  root,
  getBooks,
  getOneBook,
  insertBook,
  updateBook
};
