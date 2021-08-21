class Query {
  constructor(db) {
    this.db = db;
  }

  async insertUser(document) {
    this.db.setCollection('users');
    const recordset = await this.db.insertOne(document);
    return recordset;
  }
}

module.exports = Query;
