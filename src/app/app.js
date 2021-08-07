const cors = require('cors');
const express = require('express');
const routes = require('../routes/handler');

const server = express();

server.use(express.json());
server.use(cors({
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization']
}));

// root goes here
server.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

// grouping route
server.use('/api/v1', routes);

module.exports = server;