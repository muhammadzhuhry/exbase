const dateFormat = require('dateformat');
const validate = require('validate.js');
const Command = require('./command');
const Query = require('../queries/query');
const Model = require('./command_model');
const config = require('../../../../config');
const Mysql = require('../../../../helpers/databases/mysql/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { InternalServerError, NotFoundError } = require('../../../../helpers/error');

const mysql = new Mysql(config.get('/mysql'));
const command = new Command(mysql);
const query = new Query(mysql);

const insertBook = async (data) => {
  let payload = { ...data };

  let book = Model.book();
  book.title = payload.title;
  book.author = payload.author;
  book.description = payload.description;
  book.createdAt = dateFormat(new Date().toLocaleString(), 'yyyy-mm-dd HH:MM:ss');
  book.updatedAt = dateFormat(new Date().toLocaleString(), 'yyyy-mm-dd HH:MM:ss');

  const insert = await command.insertBook(book);
  if (insert.error) {
    return wrapper.error(new InternalServerError('failed insert book', {}));
  }

  return wrapper.data(book);
};

const updateBook = async (id, data) => {
  let payload;
  const bookId = parseInt(id);

  const book = await query.findOneBook(bookId);
  if (validate.isEmpty(book.data)) {
    return wrapper.error(new NotFoundError(`can not find book with id ${bookId}`, {}));
  }

  payload = book.data[0];

  payload.title = validate.isEmpty(data.title) ? payload.title : data.title;
  payload.author = validate.isEmpty(data.author) ? payload.author : data.author;
  payload.description = validate.isEmpty(data.description) ? payload.description : data.description;

  payload.updatedAt  = dateFormat(new Date().toLocaleString(), 'yyyy-mm-dd HH:MM:ss');

  const update = await command.updateBook(payload);
  if (update.error) {
    return wrapper.error(new InternalServerError(`failed update book with id ${bookId}`, {}));
  }

  return wrapper.data(payload);
};

module.exports = {
  insertBook,
  updateBook
};
