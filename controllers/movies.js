const Movie = require('../models/movie');

// импорт всех необходимых ошибок
const IncorrectDataErr = require('../utils/errors/incorrect-data-err');
const NotFoundError = require('../utils/errors/not-found-err');
const AccessError = require('../utils/errors/access-err');

// возвращает все сохранённые текущим пользователем фильмы
module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

// создаёт фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectDataErr('Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
};

// удаляет сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Фильма с указанным id не существует'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new AccessError('Вы не можете удалить чужой фильм');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => { res.send({ message: 'Фильм был удален' }); })
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new IncorrectDataErr('Передан несуществующий id фильма'));
          }
          return next(err);
        });
    })
    .catch((err) => { next(err); });
};
