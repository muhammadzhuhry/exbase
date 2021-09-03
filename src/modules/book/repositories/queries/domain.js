const validate = require('validate.js');
const Query = require('./query');
const Model = require('./query_model');
const config = require('../../../../global_config');
const Mysql = require('../../../../helpers/databases/mysql/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { NotFoundError, BadRequestError } = require('../../../../helpers/error');

const mysql = new Mysql(config.get('/mysql'));
const query = new Query(mysql);

const getOneBook = async (data) => {
  let bookId, result;

  bookId = parseInt(data);

  const book = await query.findOneBook(bookId);
  if (validate.isEmpty(book.data)) {
    return wrapper.error(new NotFoundError(`can not find book with id ${bookId}`, {}));
  }

  result = Model.book();
  result.title = book.data[0].title;
  result.author = book.data[0].author;
  result.description = book.data[0].description;
  result.createdAt = book.data[0].createdAt;
  result.updatedAt = book.data[0].updatedAt;

  return wrapper.data(result);
};

module.exports = {
  getOneBook
};
