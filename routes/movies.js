const movies = require('express').Router();
const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validators');

movies.get('/', getSavedMovies);
movies.post('/', createMovieValidator, createMovie);
movies.delete('/:movieId', deleteMovieValidator, deleteMovie);

module.exports = { movies };
