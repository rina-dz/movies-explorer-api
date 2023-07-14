const allowedCors = [
  'http://api.movies-explorer.rindz.nomoreparties.sbs',
  'http://localhost:3000',
  'https://api.movies-explorer.rindz.nomoreparties.sbs',
  'https://localhost:3000',
  'https://web.postman.co',
  'http://movies-explorer.rindz.nomoredomains.work',
  'https://movies-explorer.rindz.nomoredomains.work',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
  }

  return next();
};
