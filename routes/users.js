const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

users.get('/me', getUserInfo);
users.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUserInfo,
);

module.exports = { users };
