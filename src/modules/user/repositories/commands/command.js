class Query {
  constructor(mysql) {
    this.mysql = mysql;
  }

  async insertUser(payload) {
    const valueData = [payload.name, payload.email, payload.is_active, payload.created_at, payload.updated_at];
    const query = 'INSERT INTO Users (name, email, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
    const result = await this.mysql.preparedQuery(query, valueData);
    return result;
  }

  async updateUser(parameter, document){
    this.db.setCollection('users');
    const updateData = {$set : document};
    const result = await this.db.upsertOne(parameter, updateData);
    return result;
  }
}

module.exports = Query;
