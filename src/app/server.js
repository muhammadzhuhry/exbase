const cors = require('cors');
const express = require('express');
const basicAuth = require('express-basic-auth');
const config = require('../global_config');
const routes = require('../routes/handler');
const logger = require('../helpers/utils/logger');
const wrapper = require('../helpers/utils/wrapper');
const mongodbConnectionPooling = require('../helpers/databases/mongodb/connection');

const server = express();

server.use(express.json());
server.use(basicAuth({
  authorizer: (username, password) => {
    let matchUsername, matchPassword;

    matchUsername = basicAuth.safeCompare(username, config.get('/basicAuth').username);
    matchPassword = basicAuth.safeCompare(password, config.get('/basicAuth').password);
    return matchUsername, matchPassword;
  },
  unauthorizedResponse: () => {
    return 'unauthorized';
  }
}));
server.use(cors({
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization']
}));

if (config.get('/mode') !== 'PRODUCTION') server.use(logger.init());

// root goes here
server.get('/', (req, res) => {
  wrapper.response(res, 'success', wrapper.data('index'), 'this service is running properly');
});

// grouping route
server.use('/api/v1', routes);

// initiation goes here
mongodbConnectionPooling.init();

module.exports = server;
