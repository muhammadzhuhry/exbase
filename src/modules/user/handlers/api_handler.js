const express = require('express');
const queryDomain = require('../repositories/queries/domain');

const router = express.Router();

// handler list user
router.get('/', async (req, res) => {
  const getUsers = async () => queryDomain.getUsers();
  const sendResponse = async (result) => {
    (result.err) ? res.json({
      status: false,
      message: 'can not get list user',
      code: 400,
      data: result
    }) : res.json({
      status: true,
      message: 'success get list user',
      code: 200,
      data: result
    });
  };
  sendResponse(await getUsers());
});

// handler get one user
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  const getOneUser = async () => queryDomain.getOneUser(userId);
  const sendResponse = async (result) => {
    (result.err) ? res.json({
      status: false,
      message: `can not get user with id ${userId}`,
      code: 404,
      data: result
    }) : res.json({
      status: true,
      message: `success get user with id ${userId}`,
      code: 200,
      data: result
    });
  };
  sendResponse(await getOneUser());
});

module.exports = router;