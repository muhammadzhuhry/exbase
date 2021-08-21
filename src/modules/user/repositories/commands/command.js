class Query {
  constructor(db) {
    this.db = db;
  }

  async insertUser(document) {
    this.db.setCollection('users');
    const recordset = await this.db.insertOne(document);
    return recordset;
  }

  async updateUser(parameter, document){
    this.db.setCollection('users');
    const updateData = {$set : document};
    const result = await this.db.upsertOne(parameter, updateData);
    return result;
  }
}

module.exports = Query;
