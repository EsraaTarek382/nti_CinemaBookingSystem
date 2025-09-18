import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    seatNumber: String,
    isBooked: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    lockedUntil: Date // for temporary lock
});

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    startTime: { type: Date, required: true },
    seats: [seatSchema],
    price: { type: Number, required: true },
    screen: { type: String, required: true }
});

const Showtime = mongoose.model("Showtime", showtimeSchema);

export default Showtime;