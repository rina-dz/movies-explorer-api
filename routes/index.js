const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const { users } = require('./users');
const { movies } = require('./movies');
const { auth } = require('../middlewares/auth');
// const { loginValidator, createUserValidator } = require('../middlewares/validators');
const NotFoundError = require('../utils/errors/not-found-err');

routes.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

routes.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

routes.use('/users', auth, users);
routes.use('/movies', auth, movies);

routes.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрос по несуществующему маршруту'));
});

module.exports = { routes };
