const express = require('express');
const queryDomain = require('../repositories/queries/domain');

const router = express.Router();

// handler list user
router.get('/', async (req, res) => {
  const getRequest = async () => queryDomain.getUsers();
  const sendResponse = async (result) => {
    (result.err) ? res.json({
      status: false,
      message: 'list user',
      code: 400,
      data: result
    }) : res.json({
      status: true,
      message: 'list user',
      code: 200,
      data: result
    });
  };
  sendResponse(await getRequest());
});

router.get('/listuser', (req, res) => {
  res.json({
    message: 'list user 🌏'
  });
});

module.exports = router;