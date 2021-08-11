const validate = require('validate.js');
const mongoConnection = require('./connection');
const wrapper = require('../../utils/wrapper');

class DB {
  constructor(mongodbURL) {
    this.mongodbURL = mongodbURL;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const mongodbURL = this.mongodbURL.replace('//', '');
    const pattern = new RegExp('/([a-zA-Z0-9-_]+)?');
    const dbName = pattern.exec(mongodbURL);
    return dbName[1];
  }

  async findOne(parameter) {
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.mongodbURL);
    if (result.error) {
      console.log('error mongodb connection');
      return result;
    }

    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.findOne(parameter);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('data not found please try another input');
      }
      return wrapper.data(recordset);

    } catch (error) {
      console.log('error find data in mongodb');
      return wrapper.error(`error find one mongo ${err.message}`);
    }
  }
}

module.exports = DB;