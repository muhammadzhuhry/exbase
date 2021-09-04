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
  result.id = book.data[0].id;
  result.title = book.data[0].title;
  result.author = book.data[0].author;
  result.description = book.data[0].description;
  result.createdAt = book.data[0].createdAt;
  result.updatedAt = book.data[0].updatedAt;

  return wrapper.data(result);
};

const getBooks = async (data) => {
  let payload = {}, result = [], metadata;

  if (data.page == 0) {
    return wrapper.error(new BadRequestError('page must start from 1', []));
  }

  payload.page = parseInt(data.page) || 1;
  payload.size = parseInt(data.size) || 10;

  const books = await query.findBooks(payload);
  if (validate.isEmpty(books.data)) {
    return wrapper.error(new NotFoundError('can not find book', []));
  }

  books.data.map(data => {
    const book = Model.book();
    book.id = data.id;
    book.title = data.title;
    book.author = data.author;
    book.description = data.description;
    book.createdAt = data.createdAt;
    book.updatedAt = data.updatedAt;

    result.push(book);
  });

  const countBooks = await query.countBooks();
  const size = books.data.length;

  metadata = {
    page: payload.page,
    size: result.length,
    totalPage: Math.ceil(countBooks.data[0].total / size),
    totalData: countBooks.data[0].total
  };

  return wrapper.paginationData(result, metadata);
};

module.exports = {
  getOneBook,
  getBooks
};
