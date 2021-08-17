const cors = require('cors');
const express = require('express');
const routes = require('../routes/handler');
const logger = require('../helpers/utils/logger');
const mongodbConnectionPooling = require('../helpers/databases/mongodb/connection');

const server = express();

server.use(express.json());
server.use(cors({
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization']
}));
server.use(logger.init());

// root goes here
server.get('/', (req, res) => {
  res.json({
    message: 'This service is running properly'
  });
});

// grouping route
server.use('/api/v1', routes);

// initiation goes here
mongodbConnectionPooling.init();

module.exports = server;
