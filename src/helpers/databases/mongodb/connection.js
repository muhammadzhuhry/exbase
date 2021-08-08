const Mongo = require('mongodb').MongoClient;
const config = require('../../../global_config');
const wrapper = require('../../utils/wrapper');

const connectionPool = [];

const connection = () => {
  const connectionState = {
    index: null,
    config: '',
    db: null
  }
  return connectionState;
}

// 3. create mongodb connection
const createConnection = async (url) => {
  const options = { 
    maxPoolSize: parseInt(config.get('/mongodb').maxPoolSize),
    keepAlive: JSON.parse(config.get('/mongodb').keepAlive),
    socketTimeoutMS: parseInt(config.get('/mongodb').socketTimeout),
    connectTimeoutMS: parseInt(config.get('/mongodb').connectionTimeout),
    useNewUrlParser: JSON.parse(config.get('/mongodb').newUrlParser),
    useUnifiedTopology: JSON.parse(config.get('/mongodb').unifiedTopology),
  };

  try {
    const connection = await Mongo.connect(url, options);
    console.log('success create connection');
    return wrapper.data(connection);
  } catch (error) {
    console.log('failed create connection', error.message);
    return wrapper.error(error.message);
  }
}

// 1. create connection state and then push into connection pool
const addConnectionPool = () => {
  const connectionMongo = connection();
  connectionMongo.index = 0;
  connectionMongo.config = config.get('/mongodb').url;
  connectionPool.push(connectionMongo);
};

// 2. get connection state / mongodb config and then create connection
const createConnectionPool = async () => {
  connectionPool.map(async (currentConnection, index) => {
    console.log(currentConnection)
    const result = await createConnection(currentConnection.config);
    if (result.err) {
      connectionPool[index].db = currentConnection;
    } else {
      connectionPool[index].db = result.data;
    }
  });
};

const init = () => {
  addConnectionPool();
  createConnectionPool();
};

module.exports = {
  init
}