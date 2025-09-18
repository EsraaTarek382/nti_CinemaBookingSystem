import Movie from '../model/movies.model.js';
import { validationResult } from 'express-validator';


export const getAllMovies = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        let movies = await Movie.find({}, { '__v': false }).limit(limit).skip(skip);
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Error from Server', error: err });
    }
};

export const getMovieById = async (req, res) => {
    try {
        let id = req.params.movieId;
        let movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ message: 'Error from Server', error: err });
    }
};

export const addMovie =  async (req, res) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ message: 'Bad Request', errors: errors.array() });

        // If a poster file was uploaded, set its URL
        let movieData = { ...req.body };
        if (req.file) {
            // You may want to adjust the URL depending on your static setup
            movieData.posterUrl = `/uploads/${req.file.filename}`;
        }

        let movie = new Movie(movieData);
        await movie.save();
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).json({ message: 'Error from Server', error: err });
    }
};

export const updateMovie = async (req, res) => {
    try {
        let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Bad Request", errors: errors.array() });
      }
        let id = req.params.movieId;
        let updatedMovie = await Movie.findByIdAndUpdate(id, { $set: { ...req.body } }, { new: true });
        if (!updatedMovie) return res.status(404).json({ error: 'Movie not found' });
        res.status(200).json(updatedMovie);
    } catch (err) {
        res.status(500).json({ message: 'Error from Server', error: err });
    }
};

export const deleteMovie = async (req, res) => {
    try {
        let id = req.params.movieId;
        let deletedMovie = await Movie.findByIdAndDelete(id);
        if (!deletedMovie) return res.status(404).json({ error: 'Movie not found' });
        res.status(200).json({ message: 'Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error from Server', error: err });
    }
};

