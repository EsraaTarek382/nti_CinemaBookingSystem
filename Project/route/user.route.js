import express from 'express'
import userController from '../controller/user.controller.js'
import verifyToken from '../middleware/verifyToken.js'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let ext = file.mimetype.split('/')[1]
        let fileName = `user-${Date.now()}.${ext}`
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    let type = file.mimetype.split('/')[0]
    if (type !== 'image') return cb(new Error('This file is not an image'), false)
    cb(null, true)
}

const upload = multer({ storage, fileFilter })
const router = express.Router()

// Get all users (protected)
router.get('/', verifyToken, userController.getAllUsers)

// Register a new user
router.post('/register', upload.single('avatar'), userController.register)

// Login
router.post('/login', userController.login)

router.put('/:id', verifyToken, userController.updateUser)

router.delete('/:id', verifyToken, userController.deleteUser)


export default router
