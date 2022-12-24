const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const config = require('../global_config');

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  isValidPassword(password) {
    return this.password === password;
  }
}

module.exports.findByUsername = (username, cb) => {
  const userDatas = config.get('/basicAuth');
  let userData;

  userData = userDatas.map((value) => {
    if (value.username === username) {
      return value;
    }
    return '';
  });
  const user = new User(userData[0].username, userData[0].password);
  cb(user);
};


passport.use('basicAuth', new BasicStrategy((username, password, callback) => {
  this.findByUsername(username, (user) => {
    if (!user) {
      return callback(null, false);
    }

    if (!user.isValidPassword(password)) {
      return callback(null, false);
    }
    return callback(null, user);

  });
}));

const isAuthenticated = passport.authenticate('basicAuth', { session: false });

const init = () => passport.initialize();

module.exports = {
  isAuthenticated,
  init
};
