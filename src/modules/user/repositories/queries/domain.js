const Query = require('./query');
const config = require('../../../../global_config');
const Mongo = require('../../../../helpers/databases/mongodb/db');

const mongodb = new Mongo(config.get('/mongodb').url);
const query = new Query(mongodb);

const getUsers = async () => {
  const users = listUsers;
  if (users.err) {
    console.log('error');
  }
  return users
}

const getOneUser = async (data) => {
  const userId = parseInt(data);
  const user = await query.findOneUser({ id: userId });
  if (user.length === 0) {
    console.log('error');
  }
  return user
}

let listUsers = [
  {
    id: 0,
    name: 'Ahmad khareduin',
    gender: 'Male'
  },
  {
    id: 1,
    name: 'Bella Tanes',
    gender: 'Female'
  },
  {
    id: 2,
    name: 'Ciko Gab',
    gender: 'Male'
  },
  {
    id: 3,
    name: 'Danisla Meredi',
    gender: 'Female'
  },
  {
    id: 4,
    name: 'Eko Ridho Manrudi',
    gender: 'Male'
  }
]

module.exports = {
  getUsers,
  getOneUser
}