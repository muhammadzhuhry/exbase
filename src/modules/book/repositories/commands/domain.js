const dateFormat = require('dateformat');
const Command = require('./command');
const Model = require('./command_model');
const config = require('../../../../global_config');
const Mysql = require('../../../../helpers/databases/mysql/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { InternalServerError } = require('../../../../helpers/error');

const mysql = new Mysql(config.get('/mysql'));
const command = new Command(mysql);

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

module.exports = {
  insertBook
};
