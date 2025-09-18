import {body} from 'express-validator'

let movieValidation = [
                body('title')
                    .notEmpty().withMessage('Movie title is required')
                    .isLength({min:2}).withMessage('Movie title should be at least 2 chars'),
                body('description')
                    .notEmpty().withMessage('Description is required')
                    .isLength({min:3}).withMessage('Description should be at least 3 chars'),
                body('genre')
                    .notEmpty().withMessage('Genre is required')
                    .isLength({min:1}).withMessage('Genre should be at least 1 char'),
                body('duration')
                    .notEmpty().withMessage('Duration is required')
                    .isInt({min:60}).withMessage('Duration should be at least 60 minutes'),
                body('releaseDate')
                    .notEmpty().withMessage('Release date is required')
                    .isDate().withMessage('Release date must be a valid date'),
                body('rating')
                    .notEmpty().withMessage('Rating is required')
                    .isFloat({min:0, max:10}).withMessage('Rating must be between 0 and 10'),
                body('director')
                    .notEmpty().withMessage('Director is required')
                    .isLength({min:2}).withMessage('Director should be at least 2 chars'),
                body('cast')
                    .isArray({min:1}).withMessage('Cast must have at least one member')
                    .custom((value) => {
                        for (let i = 0; i < value.length; i++) {
                            if (typeof value[i] !== 'string' || value[i].trim() === '') {
                                throw new Error('Cast members must be non-empty strings');
                            }
                        }
                        return true;
                    })
            ]

export default movieValidation;