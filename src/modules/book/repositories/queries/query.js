class Query {
  constructor(db) {
    this.db = db;
  }

  async findOneBook(bookId) {
    const valueData = [bookId];
    const query = 'SELECT * FROM tbl_books WHERE id = ?';
    const result = await this.db.query(query, valueData);
    return result;
  }

  async findBooks(parameter) {
    const limit = parameter.size;
    const offset = limit * (parameter.page - 1);
    const valueData = [limit, offset];
    const query = 'SELECT * FROM tbl_books LIMIT ? OFFSET ?';
    const result = await this.db.query(query, valueData);
    return result;
  }

  async countBooks() {
    const query = 'SELECT COUNT(*) AS total FROM tbl_books';
    const result = await this.db.query(query);
    return result;
  }
}

module.exports = Query;
