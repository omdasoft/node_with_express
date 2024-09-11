const mongoose = require('mongoose');
const fs = require('fs');

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
    },
    createdBy: String
}, {
    toJSON: {virtuals: true}, //enable the virtuals propeities to return 
    toObject: {virtuals: true} //enable virtuals to be avilable in the view
});

moviesSchema.virtual('durationInHours').get(function() { //virtuals can not be used in the query the data
    return this.duration / 60;
});

//Middleware that run before save event is fired, before calling save and create  (pre hook)
moviesSchema.pre('save', function(next) {
    this.createdBy = 'Emad';
    next();
});

//we can add more hooks for the same event 
// moviesSchema.pre('save', function(next) {
//    //ADD New Logic
// });

//Middleware that run aftert the query is saved or created (post hook)
moviesSchema.post('save', function (doc, next) {
    const data = `A new movie with name ${doc.name} has been created by user ${doc.createdBy}\n`;
    fs.writeFileSync('./Log/log.txt', data, {flag: 'a'}, (err) => {
        console.log(err.message);
    });
    next();
});

const Movie = mongoose.model('Movie', moviesSchema);

module.exports = Movie;