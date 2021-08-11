const validate = require('validate.js');
const mongoConnection = require('./connection');
const wrapper = require('../../utils/wrapper');

class DB {
  constructor(config) {
    this.config = config;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const config = this.config.replace('//', '');
    const pattern = new RegExp('/([a-zA-Z0-9-]+)?');
    const dbName = pattern.exec(config);
    return dbName[1];
  }

  async findOne(parameter) {
    const dbName = await this.getDatabase();
    console.log(dbName)
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
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

    } catch (err) {
      console.log('error find data in mongodb');
      return wrapper.error(`error find one mongo ${err.message}`);
    }
  }
}