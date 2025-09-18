import User from '../model/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Get all users (hide password & __v)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { '__v': 0, 'password': 0 })
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: 'Error from Server' })
    }
}

// Register new user
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: 'Email already exists, please login' })

        const hashedPassword = bcrypt.hashSync(password, 10)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            // avatar: req.file ? req.file.filename : '/uploads/profile.jpg'
        })

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        newUser.token = token

        await newUser.save()
        res.status(201).json({ message: 'User Created', data: newUser })
    } catch (err) {
        res.status(500).json({ message: 'Error from Server' })
    }
}

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Email not found' })

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        res.status(200).json({ message: 'Logged in successfully', token })
    } catch (err) {
        res.status(500).json({ message: 'Error from Server' })
    }
}
// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { firstName, lastName, email, password, role } = req.body

        const updateData = { firstName, lastName, email, role }

        if (password) {
            updateData.password = bcrypt.hashSync(password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        if (!updatedUser) return res.status(404).json({ message: 'User not found' })

        res.status(200).json({ message: 'User updated successfully', data: updatedUser })
    } catch (err) {
        res.status(500).json({ message: 'Error from Server' })
    }
}

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) return res.status(404).json({ message: 'User not found' })

        res.status(200).json({ message: 'User deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Error from Server' })
    }
}

export default {
    getAllUsers,
    register,
    login,
    updateUser,
    deleteUser
}
