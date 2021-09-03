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
}

module.exports = Query;
