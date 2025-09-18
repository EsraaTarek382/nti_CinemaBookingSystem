# 🎟️ Cinema Booking System (MEAN Stack)

A full-stack web application that allows users to browse movies, view showtimes, select seats, and book tickets online.  
Built with **MongoDB**, **Express.js**, **Angular**, and **Node.js** (MEAN).

---

## 🚀 Features

### 🎥 For Customers
- Browse currently showing and upcoming movies
- View detailed movie information and trailers
- Check available showtimes by date and screen
- Choose and lock seats in real time
- Secure checkout for booking tickets
- View and manage booking history

### 🛠️ For Admins
- Add / update / delete movies
- Create and manage showtimes
- Configure screens and seat layouts
- View bookings dashboard

---

## 🏗️ Tech Stack

- **Frontend**: Angular 16+, Bootstrap / Tailwind for UI
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT-based user and admin auth
- **Deployment**: (optional) Docker / AWS / Heroku

---

## 📂 Project Structure

```bash
cinema-booking-system/
├── backend/
│   ├── server.js              # Entry point
│   ├── routes/                # Express routes
│   ├── controllers/           # Controller logic
│   ├── models/                # Mongoose models
│   ├── middleware/            # Auth, roles, error handling
│   └── config/                # DB connection, env vars
│
├── frontend/
│   ├── src/app/
│   │   ├── components/        # Angular components
│   │   ├── services/          # Angular services (API calls)
│   │   ├── guards/            # Auth guards
│   │   └── app.module.ts
│   └── angular.json
│
└── README.md
