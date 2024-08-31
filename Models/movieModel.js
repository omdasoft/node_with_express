const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is required!'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description field is required!'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration field is required']
    },
    rating: {
        type: Number,
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year field is required']
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    genres: {
        type: [String],
        required: [true, 'Genres field is required']
    },
    directors: {
        type: [String],
        required: [true, 'Directors field is required']
    },
    coverImage: {
        type: [String],
        required: [true, 'Cover image field is required']
    },
    actors: {
        type: [String],
        required: [true, 'Actors field is required']
    },
    price: {
        type: Number,
        required: [true, 'Price field is required']
    }
})

const Movie = mongoose.model('Movie', moviesSchema);

module.exports = Movie;