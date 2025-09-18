import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime", required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    seats: [String],
    status: { type: String, enum: ['Booked', 'Cancelled', 'Paid'], default: 'Booked' },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;