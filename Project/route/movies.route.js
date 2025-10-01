import express from 'express';
import * as movieController from '../controller/movies.controller.js';
import movieValidation from '../middleware/validation.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { verify } from 'crypto';
import verifyToken from '../middleware/verifyToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'movie-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
const upload = multer({ storage, fileFilter });

let moviesrouter = express.Router();



moviesrouter.route('/')
    .get( movieController.getAllMovies)
    .post(verifyToken,
        upload.single('poster'),
        movieValidation,
        movieController.addMovie
    );




moviesrouter.route('/')
    .get( movieController.getAllMovies)
    .post(verifyToken,
        upload.single('poster'),
        movieValidation,
        movieController.addMovie
    );

moviesrouter.route('/:movieId')
    .get(verifyToken, movieController.getMovieById)
    .put(verifyToken, movieValidation, movieController.updateMovie)
    .delete(verifyToken, movieController.deleteMovie);

export default moviesrouter;
