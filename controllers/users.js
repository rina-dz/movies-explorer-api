const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// импорт всех необходимых ошибок
const IncorrectDataErr = require('../utils/errors/incorrect-data-err');
const NotFoundError = require('../utils/errors/not-found-err');
const UniqueError = require('../utils/errors/unique-err');
const AuthError = require('../utils/errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// возвращает информацию о пользователе (email и имя)
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectDataErr('Переданы некорректные данные.'));
      }
      return next(err);
    });
};

// обновляет информацию о пользователе (email и имя)
module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user && String(user._id) !== req.user) {
        return next(new UniqueError('Данный email уже занят.'));
      }
      return User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true },
      )
        .then((newUser) => res.send(newUser))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new IncorrectDataErr('Переданы некорректные данные при изменении информации.'));
          }
          return next(err);
        });
    })
    .catch(next);
};

// регистрация пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new UniqueError('Указанная вами почта уже занята.'));
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectDataErr('Переданы некорректные данные при создании пользователя.'));
      }
      return next(err);
    });
};

// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильные почта или пароль'));
          }
          return res.send({ token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }) });
        });
    })
    .catch(next);
};
