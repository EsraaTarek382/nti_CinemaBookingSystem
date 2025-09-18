import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import movieRouter from './route/movies.route.js'
import userRouter from './route/user.route.js'
import showtimeRouter from './route/showtime.route.js'
import bookingRouter from './route/booking.route.js'
import connection from './db/connection.js'
import path from'node:path'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/movies',movieRouter)
app.use('/api/users',userRouter)
app.use('/api/showtimes', showtimeRouter)
app.use('/api/bookings', bookingRouter)
// app.use('/uploads', express.static(path.join(__dirname,'uploads'))) // 'C:\Users\it legend\OneDrive\Documents\MEAN-Stack NTI Summer Course\NodeJs & MongoDB\day3\courses-app\uploads'
 
    connection()
    
    app.all('/{*any}',(req,res) => {
        res.status(404).json({message: 'This resource is not found'})
    }) // To Handle wrong calls or any exception

const port= process.env.port || 3001
app.listen(port,()=>{
    console.log('Listening on port 3001')
})