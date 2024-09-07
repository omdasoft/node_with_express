const { query } = require('express');
const Movie = require('./../Models/movieModel');
const ApiFeatures = require('./../Utils/ApiFeatures');
const { now } = require('mongoose');

//middleware to add top rated query params when get all movies
exports.getTopRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-totalRating'; 

    next();
}

exports.allMovies = async (req, res) => {
    try {
        const feature = new ApiFeatures(Movie.find(), req.query).filter().sort().limitFields().pagination();
        let movies = await feature.query;
        // const excludedFields = ['sort', 'page', 'limit', 'fields'];
        // const queryObject = {...req.query};
        
        // excludedFields.forEach((el) => {
        //     delete queryObject[el];
        // })

        // let queryString = JSON.stringify(req.query);
        // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // const queryObj = JSON.parse(queryString);
        // let query = Movie.find(queryObject);

        //sort the result
        // if (req.query.sort) {
        //     const sortByfields = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortByfields);
        // } else {
        //     query = query.sort('-createdAt');
        // }

        //Limit the fields
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // } else {
        //     query = query.select('-__v');
        // }

        //pagination
        // const page = req.query.page;
        // const limit = req.query.limit;
        // const skip = (page - 1) * limit;

        // query = query.skip(skip).limit(limit);

        // if (req.query.page) {
        //     const moviesCount = await Movie.countDocuments();
        //     if (skip >= moviesCount) {
        //         throw new Error("No more records");
        //     }
        // }

        // const movies = await query;
        // const movies = await Movie.find()
        //     .where('duration').gte(req.query.duration)
        //     .where('totalRatings').gte(req.query.totalRatings)
        //     .where('price').lte(req.query.price);

        return res.status(200).json({
            status: "success",
            count: movies.length,
            data: {
                movies
            }
        })
    } catch(error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        return res.status(200).json({
            status: "success",
            data: {
                movie: movie
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.getMovie = async (req, res) => {
    try {
        // const movie = await Movie.find({_id: req.params.id});
        const movie = await Movie.findById(req.params.id);
        return res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        return res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            status: "success",
            message: "Movie delete successfully"
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.getMovieStats = async (req, res) => {
    try {
        const stats = await Movie.aggregate([
            // {$match: {releaseYear: now().getFullYear()}},
            {$match: {totalRating: {$gte: 200}}},
            {$group: {
                _id:'$releaseYear',
                avgRating: {$avg: '$totalRating'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'},
                priceTotal: {$sum: '$price'},
                totalMovies: {$sum: 1}
            }},
            {$sort: { priceTotal: 1}},
            // {$match: {maxPrice: {$lte: 50}}}
        ]);

        res.status(200).json({
            status: "success",
            count: stats.length,
            data: {
                stats
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.getMovieByGenre = async (req, res) => {
    try {   
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            {$unwind: '$genres'},
            {$group: {
                _id: '$genres',
                moviesCount: {$sum: 1},
                movies: {$push: '$name'}
            }},
            {$addFields: {genre: "$_id"}}, //fields that want to include in the result
            {$project: {_id: 0}}, //fields you want to return 1 to include 0 to reject
            {$sort: {moviesCount: -1}}, //sort the result by the moviesCount in decending order
            // {$limit: 6} //limit the result
            {$match: {genre: genre}} //filter the final result by genre
        ]);

        return res.status(200).json({
            status: "success",
            count: movies.length,
            data: {
                movies
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
}