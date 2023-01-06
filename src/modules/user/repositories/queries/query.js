class Query {
  constructor(db) {
    this.db = db;
  }

  async findOneUser(parameter) {
    this.db.setCollection('users');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findUserByEmail(email) {
    const valueData = [email];
    const query = 'SELECT * FROM Users WHERE email = ?';
    const result = await this.db.preparedQuery(query, valueData);
    return result;
  }

  async findUsers(fieldName, row, page, parameter) {
    this.db.setCollection('users');
    const recordset = await this.db.findMany(fieldName, row, page, parameter);
    return recordset;
  }

  async countUsers() {
    this.db.setCollection('users');
    const recordset = await this.db.countData();
    return recordset;
  }
}

module.exports = Query;
