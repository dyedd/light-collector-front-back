const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "dyedd";
const getToken = (data, time) => {
  return jwt.sign({ data }, secretOrPrivateKey, {
    expiresIn: time,
  });
};
module.exports = getToken;
