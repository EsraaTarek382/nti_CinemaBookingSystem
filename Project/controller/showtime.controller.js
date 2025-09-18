import Showtime from '../model/showtime.model.js';
import { validationResult } from 'express-validator';

// Admin only middleware import
import allowedTo from '../middleware/allowedTo.js';

// Create showtime (Admin only)
export const createShowtime = async (req, res) => {
    // ...validation logic...
    const { movie, startTime, price, screen } = req.body;
    
    // Fixed seat layout - same for every showtime
    const seatLayout = [
        { row: 'A', seats: 8, offset: 2 },
        { row: 'B', seats: 10, offset: 1 },
        { row: 'C', seats: 12, offset: 0 },
        { row: 'D', seats: 12, offset: 0 },
        { row: 'E', seats: 12, offset: 0 },
        { row: 'F', seats: 12, offset: 0 },
        { row: 'G', seats: 10, offset: 1 },
        { row: 'H', seats: 8, offset: 2 }
    ];
    
    // Generate seats based on the fixed layout
    const seats = [];
    seatLayout.forEach(rowInfo => {
        for (let i = 1; i <= rowInfo.seats; i++) {
            seats.push({
                seatNumber: `${rowInfo.row}${i}`,
                isBooked: false,
                isLocked: false
            });
        }
    });
    
    const showtime = new Showtime({ movie, startTime, seats, price, screen });
    await showtime.save();
    res.status(201).json(showtime);
};

// Get all showtimes
export const getAllShowtimes = async (req, res) => {
    const showtimes = await Showtime.find().populate('movie');
    res.status(200).json(showtimes);
};

export const getShowtimeByMovieId = async (req, res) => {
    const { id } = req.params;
    const showtimes = await Showtime.find({ movie: id }).populate('movie');
    if (!showtimes || showtimes.length === 0) return res.status(404).json({ error: "No showtimes found for this movie" });
    res.status(200).json(showtimes);
};

// Update showtime (Admin only)
export const updateShowtime = async (req, res) => {
    const { id } = req.params;
    const updated = await Showtime.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
};

// Delete showtime (Admin only)
export const deleteShowtime = async (req, res) => {
    const { id } = req.params;
    await Showtime.findByIdAndDelete(id);
    res.status(200).json({ message: "Showtime deleted" });
};

// Lock seat temporarily
export const lockSeat = async (req, res) => {
    const { showtimeId, seatNumber } = req.body;
    const showtime = await Showtime.findById(showtimeId);
    const seat = showtime.seats.find(s => s.seatNumber === seatNumber);
    if (seat.isBooked || seat.isLocked) return res.status(400).json({ error: "Seat unavailable" });
    seat.isLocked = true;
    seat.lockedUntil = new Date(Date.now() + 5 * 60 * 1000); // lock for 5 min
    await showtime.save();
    res.status(200).json({ message: "Seat locked" });
};

// Unlock seat
export const unlockSeat = async (req, res) => {
    const { showtimeId, seatNumber } = req.body;
    const showtime = await Showtime.findById(showtimeId);
    const seat = showtime.seats.find(s => s.seatNumber === seatNumber);
    seat.isLocked = false;
    seat.lockedUntil = null;
    await showtime.save();
    res.status(200).json({ message: "Seat unlocked" });
};