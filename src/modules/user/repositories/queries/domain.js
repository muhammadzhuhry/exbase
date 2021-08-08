
const getUsers = async () => {
  const users = listUsers;
  if (users.err) {
    console.log('error');
  }
  return users
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
  getUsers
}