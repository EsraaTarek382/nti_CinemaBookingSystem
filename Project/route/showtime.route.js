import express from 'express';
import * as showtimeController from '../controller/showtime.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import allowedTo from '../middleware/allowedTo.js';

const router = express.Router();

router.post('/', verifyToken, showtimeController.createShowtime);
router.get('/', showtimeController.getAllShowtimes);
router.get('/:id', showtimeController.getShowtimeByMovieId);
router.put('/:id', verifyToken, allowedTo('Admin'), showtimeController.updateShowtime);
router.delete('/:id', verifyToken, allowedTo('Admin'), showtimeController.deleteShowtime);

router.post('/lock', verifyToken, showtimeController.lockSeat);
router.post('/unlock', verifyToken, showtimeController.unlockSeat);

export default router;