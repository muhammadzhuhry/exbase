class Query {
  constructor(db) {
    this.db = db;
  }

  async insertBook(data) {
    const valueData = [data.title, data.author, data.description, data.createdAt, data.updatedAt];
    const query = 'INSERT INTO tbl_books (title, author, description, createdAt, updatedAt) VALUES (?,?,?,?,?)';
    const result = await this.db.query(query, valueData);
    return result;
  }

  async updateBook(data) {
    const valueData = [data.title, data.author, data.description, data.updatedAt];
    const query = 'UPDATE tbl_books SET title = ?, author = ?, description = ?, updatedAt = ?';
    const result = await this.db.query(query, valueData);
    return result;
  }
}

module.exports = Query;
