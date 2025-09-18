import mongoose from 'mongoose';
import validator from 'validator'; // Fix: use 'validator' correctly

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3 // Fix: use minlength instead of min for strings
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid Email Format']
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    avatar: {
        type: String,
        default: '/uploads/profile.jpg'
    }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel; // Fix: export the model directly
