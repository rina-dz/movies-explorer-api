const movies = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const IncorrectDataErr = require('../utils/errors/incorrect-data-err');
// const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validators');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new IncorrectDataErr('Неправильный формат ссылки');
  }
  return value;
};

movies.get('/', getSavedMovies);
movies.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().custom(validateURL).required(),
      trailerLink: Joi.string().custom(validateURL).required(),
      thumbnail: Joi.string().custom(validateURL).required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);
movies.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = { movies };
