const express = require('express');
const morgan = require('morgan');
let app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.static('./public'));
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
});

//Movies router
const moviesRouter = require('./Routes/moviesRouter');

//Get - api/v1/movies
// app.get('/api/v1/movies', allMovies);

// app.get('/api/v1/movies', (req, res) => {
//     res.status(200).json({
//         status: "success",
//         count: movies.length,
//         data: {
//             movies: movies
//         }
//     });
// })

//Post - api/v1/movies
// app.post('/api/v1/movies', postMovie);

// //Get movie - api/v1/movies/id
// app.get('/api/v1/movies/:id', getMovie);

// //Update movie - api/v1/movies/:id
// app.patch('/api/v1/movies/:id', updateMovie);

// //Delete movie - api/v1/movies/:id
// app.delete('/api/v1/movies/:id', deleteMovie);

//Short version
// app.route('/api/v1/movies')
//     .get(allMovies)
//     .post(postMovie)

// app.route('/api/v1/movies/:id')
//     .get(getMovie)
//     .patch(updateMovie)
//     .delete(deleteMovie)

//     app.route('/api/v1/movies')
//     .get(allMovies)
//     .post(postMovie)

// app.route('/api/v1/movies/:id')
//     .get(getMovie)
//     .patch(updateMovie)
//     .delete(deleteMovie)
    
app.use('/api/v1/movies', moviesRouter);

module.exports = app;