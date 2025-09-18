import Booking from '../model/booking.model.js';
import Showtime from '../model/showtime.model.js';

// Create booking
export const createBooking = async (req, res) => {
    const { showtimeId, seats } = req.body;
    const userId = req.user._id;

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });
    const movieId = showtime.movie;
    const totalPrice = seats.length * showtime.price;
    // Check seat availability
    for (let seatNum of seats) {
        const seat = showtime.seats.find(s => s.seatNumber === seatNum);
        if (!seat || seat.isBooked || seat.isLocked) return res.status(400).json({ error: `Seat ${seatNum} unavailable` });
        seat.isBooked = true;
        seat.isLocked = false;
        seat.lockedUntil = null;
    }
    await showtime.save();
    const booking = new Booking({
      userId,
      showtimeId,
      movieId,
      seats,
      totalPrice
    });
    await booking.save();
    res.status(201).json(booking);
};

// Booking history
export const getBookingHistory = async (req, res) => {
    const userId = req.user._id;
    const bookings = await Booking.find({ userId: userId }).populate('showtimeId');
    res.status(200).json(bookings);
};

// Cancel booking (if not paid)
export const cancelBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (booking.status === 'Paid') return res.status(400).json({ error: "Cannot cancel paid booking" });
    booking.status = 'Cancelled';
    await booking.save();
    res.status(200).json({ message: "Booking cancelled" });
};

// Simulate payment
export const payBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (booking.status !== 'Booked') return res.status(400).json({ error: "Booking not valid for payment" });
    booking.status = 'Paid';
    await booking.save();
    res.status(200).json({ message: "Booking marked as paid" });
};

// Admin: list all bookings
export const getAllBookings = async (req, res) => {
    const bookings = await Booking.find().populate('userId showtime');
    res.status(200).json(bookings);
};