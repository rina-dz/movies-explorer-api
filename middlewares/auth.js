const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }

  const token = auth.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
