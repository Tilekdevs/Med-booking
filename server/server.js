import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { initDatabase } from './db.js'
import appointmentRoutes from './routes/appointments.js'
import authRoutes from './routes/auth.js'
import doctorRoutes from './routes/doctors.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 8085

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Initialize database
await initDatabase()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)

// Root API endpoint
app.get('/api', (req, res) => {
	res.json({ message: 'Med Booking API', version: '1.0.0', status: 'running' })
})

// Health check
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', message: 'Server is running' })
})

app.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`)
	console.log(`📍 API Base: http://localhost:${PORT}/api`)
})
