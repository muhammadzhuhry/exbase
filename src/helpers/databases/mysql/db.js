const validate = require('validate.js');
const mysqlPool = require('./connection');
const wrapper = require('../../utils/wrapper');

class DB {
  constructor(config) {
    this.config = config;
  }

  errorMessage(code) {
    switch(code) {
    case 'PROTOCOL_CONNECTION_LOST':
      return 'Database connection was closed.';
    case 'ER_CON_COUNT_ERROR':
      return 'Database has too many connections.';
    case 'ECONNREFUSED':
      return 'Database connection was refused.';
    }
  }

  async query(statement) {
    let db = await mysqlPool.getConnection(this.config);
    if (validate.isEmpty(db)) {
      db = await mysqlPool.createConnectionPool(this.config);
    }
    const recordset = () => {
      return new Promise((resolve, reject) => {
        db.getConnection((error, connection) => {
          if (error) {
            connection.release();
            return reject(wrapper.error(this.errorMessage(error.code)));
          }

          connection.query(statement, (error, result) => {
            if (error) {
              connection.release();
              return reject(wrapper.error(error.message));
            }

            connection.release();
            return resolve(wrapper.data(result));
          });
        });
      });
    };
    return recordset().then(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  async preparedQuery(statement,  escape = null) {
    let db = await mysqlPool.getConnection(this.config);
    if (validate.isEmpty(db)) {
      db = await mysqlPool.createConnectionPool(this.config);
    }
    const recordset = () => {
      return new Promise((resolve, reject) => {
        db.getConnection((error, connection) => {
          if (error) {
            connection.release();
            return reject(wrapper.error(this.errorMessage(error.code)));
          }

          connection.query(statement, escape, (error, result) => {
            if (error) {
              connection.release();
              return reject(wrapper.error(error.message));
            }

            connection.release();
            return resolve(wrapper.data(result));
          });
        });
      });
    };
    return recordset().then(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }
}

module.exports = DB;
