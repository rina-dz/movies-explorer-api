require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const { routes } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rateLimiter');

const { DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('MongoDB работает');
  })
  .catch((err) => {
    console.log(`Что-то идёт не так: ${err}`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);
app.use(limiter);
app.use(helmet());

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);

app.use(errors());

app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
