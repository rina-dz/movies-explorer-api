const users = require('express').Router();
const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/validators');

users.get('/me', getUserInfo);
users.patch('/me', updateUserValidator, updateUserInfo);

module.exports = { users };
