import mongoose from "mongoose";

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 1
    },
    description:{
        type: String,
        required: true,
        min: 3
    },
    genre: {
        type: String,
        required: true,
        min: 1
    },
    duration: {
        type: Number,
        required: true,
        min: 60 // duration in minutes
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    director: {
        type: String,
        required: true,
        min: 2
    },
    cast: {
        type: [String],
        required: true,
    },
    posterUrl: {
        type: String,
        required: false
    }
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
