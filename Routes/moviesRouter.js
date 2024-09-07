const express = require('express');
const moviesController = require('./../Controllers/moviesController');

const router = express.Router();

// router.param('id', moviesController.checkMovie);

router.route('/movie-stats').get(moviesController.getMovieStats);
router.route('/movies-by-genre/:genre').get(moviesController.getMovieByGenre);
router.route('/top-rated')
    .get(moviesController.getTopRated, moviesController.allMovies);
router.route('/')
    .get(moviesController.allMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports = router;