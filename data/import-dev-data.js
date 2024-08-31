const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Movie = require('./../Models/movieModel');

dotenv.config({path: './config.env'});

//Connect to mongo db
mongoose.connect(process.env.CONN_STR).then((conn) => {
    console.log("connected successfully");
}).catch((error) => {
    console.log("some error occured");
});

//Read movies json file
const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

//Delete all movies in db
const deleteMovies = async () => {
    try {
        await Movie.deleteMany();
        console.log("movies deleted successfully");
    } catch (error) {
        console.log(error.message);
    }
}

//Import movies into db
const importMovies = async () => {
    try {
        await deleteMovies();
        await Movie.create(movies);
        console.log("movies imported successfully");
    } catch (error) {
        console.log(error.message);
    }

    process.exit();
}

if (process.argv[2] === '--import') {
    importMovies();
}

if (process.argv[2] === '--delete') {
    deleteMovies();
}

// console.log(process.argv);


