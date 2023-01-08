class Query {
  constructor(mysql) {
    this.mysql = mysql;
  }

  async registerUser(payload) {
    const valueData = [payload.name, payload.email, payload.password, payload.is_active, payload.created_at, payload.updated_at];
    const query = 'INSERT INTO Users (name, email, password, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
    const result = await this.mysql.preparedQuery(query, valueData);
    return result;
  }

  async updateUser(payload) {
    const valueData = [payload.name, payload.email, payload.updated_at, payload.id];
    const query = 'UPDATE Users SET name = ?, email = ?, updated_at = ? WHERE id = ?';
    const result = await this.mysql.preparedQuery(query, valueData);
    return result;
  }
}

module.exports = Query;
