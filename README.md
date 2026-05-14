# 🏥 Med Booking - Medical Appointment Booking System

A modern, full-stack web application for booking medical appointments. This system allows patients to book appointments with doctors and provides an admin panel for managing appointments and doctor profiles.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Project Architecture](#project-architecture)

---

## ✨ Features

### For Patients

- 👤 **User Authentication** - Secure login and registration
- 📅 **Browse Doctors** - View available doctors with profiles
- 📝 **Book Appointments** - Easy appointment booking with date/time selection
- 📊 **Dashboard** - View personal appointment history and details
- 🔒 **Privacy** - Protected routes ensuring only authenticated users can access

### For Administrators

- 🛠️ **Admin Panel** - Manage all appointments and doctor data
- 👨‍⚕️ **Doctor Management** - Add, edit, and view doctor profiles
- 📅 **Appointment Management** - View and manage all appointments
- 📈 **Analytics** - Track bookings and appointment status

---

## 🛠️ Tech Stack

### Frontend

- **React** 18+ - UI library
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **SCSS** - Advanced styling
- **Context API** - State management for authentication

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for authentication

---

## 📁 Project Structure

```
Med-booking/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── DoctorModal.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/          # React Context for state management
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DoctorPage.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/         # API service calls
│   │   │   └── api.jsx
│   │   ├── style/            # SCSS stylesheets
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
├── server/                    # Backend Node.js/Express application
│   ├── routes/
│   │   ├── auth.js          # Authentication routes (login, register)
│   │   ├── appointments.js  # Appointment CRUD operations
│   │   └── doctors.js       # Doctor profile operations
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── db.js                # Database connection
│   ├── server.js            # Main server file
│   ├── package.json
│   └── README.md
│
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Tilekdevs/Med-booking.git
   cd Med-booking
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

#### Option 1: Using provided scripts (Windows)

```bash
cd client
npm run start.bat
```

#### Option 2: Manual startup

**Terminal 1 - Start Backend Server:**

```bash
cd server
npm start
```

Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Development Server:**

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📖 Usage

### Registration & Login

1. Navigate to the home page
2. Click **Register** to create a new account
3. Fill in your details and submit
4. Log in with your credentials

### Booking an Appointment

1. After logging in, go to **Book Appointment**
2. Browse available doctors
3. Select a doctor and choose your preferred date/time
4. Submit the appointment request

### View Appointments

1. Go to your **Dashboard**
2. See all your scheduled appointments
3. View appointment details

### Admin Access

1. Log in with admin credentials
2. Access **Admin Panel** from the navigation menu
3. Manage doctors and appointments
4. View all system data

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires token)

### Appointments

- `GET /api/appointments` - Get all appointments (admin)
- `GET /api/appointments/user/:userId` - Get user appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/doctors` - Create doctor (admin)
- `PUT /api/doctors/:id` - Update doctor (admin)
- `DELETE /api/doctors/:id` - Delete doctor (admin)

---

## 🔐 Environment Variables

### Server (.env in server directory)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/med_booking
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Client (vite.config.js)

```javascript
API_URL=http://localhost:5000/api
```

---

## 🏗️ Project Architecture

### Authentication Flow

```
User Registration/Login
       ↓
JWT Token Generated
       ↓
Token Stored in Context
       ↓
Protected Routes Check Token
       ↓
Access Granted/Denied
```

### Data Flow

```
React Component
       ↓
API Service Call (api.jsx)
       ↓
Express Server Route
       ↓
MongoDB Database
       ↓
Response Back to Component
       ↓
Context Update/State Change
       ↓
UI Re-render
```

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📝 License

This project is private and owned by Tilekdevs.

---

## 📞 Support

For issues, questions, or suggestions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ by Tilekdevs**
