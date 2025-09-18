import express from 'express';
import * as bookingController from '../controller/booking.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import allowedTo from '../middleware/allowedTo.js';

const router = express.Router();

router.post('/', verifyToken, bookingController.createBooking);
router.get('/history', verifyToken, bookingController.getBookingHistory);
router.put('/cancel/:id', verifyToken, bookingController.cancelBooking);
router.put('/pay/:id', verifyToken, bookingController.payBooking);

// Admin only
router.get('/', verifyToken, bookingController.getAllBookings);

export default router;