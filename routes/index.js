const routes = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { users } = require('./users');
const { movies } = require('./movies');
const { auth } = require('../middlewares/auth');
const { loginValidator, createUserValidator } = require('../middlewares/validators');
const NotFoundError = require('../utils/errors/not-found-err');

routes.post('/signin', loginValidator, login);

routes.post('/signup', createUserValidator, createUser);

routes.use('/users', auth, users);
routes.use('/movies', auth, movies);

routes.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрос по несуществующему маршруту'));
});

module.exports = { routes };
