class Query {
  constructor(db) {
    this.db = db;
  }

  async findUsers(fieldName, row, page, parameter) {
    this.db.setCollection('users');
    const recordset = await this.db.findMany(fieldName, row, page, parameter);
    return recordset;
  }

  async findOneUser(parameter) {
    this.db.setCollection('users');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }
}

module.exports = Query;
