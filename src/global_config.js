require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  name: process.env.NAME,
  baseUrl: process.env.BASEURL,
  env: process.env.MODE,
  mongodb: {
    url: process.env.MONGO_DATABASE_URL,
    maxPoolSize: process.env.MONGO_MAX_POOL_SIZE,
    keepAlive: process.env.MONGO_KEEP_ALIVE,
    socketTimeout: process.env.MONGO_SOCKET_TIMEOUT,
    connectionTimeout: process.env.MONGO_CONNECTION_TIMEOUT,
    newUrlParser: process.env.MONGO_NEW_URL_PARSER,
    unifiedTopology: process.env.MONGO_UNIFIED_TOPOLOGY
  }
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
