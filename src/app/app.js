const cors = require('cors');
const express = require('express');

const server = express();

server.use(express.json());
server.use(cors({
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization']
}));

// route goes here
server.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

module.exports = server;