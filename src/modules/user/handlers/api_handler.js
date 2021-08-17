const express = require('express');
const queriesDomain = require('../repositories/queries/domain');
const wrapper = require('../../../helpers/utils/wrapper');
const { ERROR:httpError, SUCCESS:http } = require('../../../helpers/http-status/status-code');

const router = express.Router();

// handler list user
router.get('/', async (req, res) => {
  const getUsers = async () => queriesDomain.getUsers();
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

  const getOneUser = async () => queriesDomain.getOneUser(userId);
  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, `can not get user with id ${userId}`, httpError.NOT_FOUND)
      : wrapper.response(res, 'success', result, `success get user with id ${userId}`, http.OK);
  };
  sendResponse(await getOneUser());
});

module.exports = router;
