import express from 'express'
import { getDb } from '../db.js'
import { verifyAdmin, verifyToken } from '../middleware/auth.js'

const router = express.Router()
const db = getDb()

// Get all doctors
router.get('/', verifyToken, (req, res) => {
	db.all('SELECT * FROM doctors', (err, doctors) => {
		if (err) {
			return res.status(500).json({ message: 'Database error' })
		}
		res.json(doctors || [])
	})
})

// Get doctor by ID
router.get('/:id', verifyToken, (req, res) => {
	const { id } = req.params

	db.get('SELECT * FROM doctors WHERE id = ?', [id], (err, doctor) => {
		if (err) {
			return res.status(500).json({ message: 'Database error' })
		}

		if (!doctor) {
			return res.status(404).json({ message: 'Doctor not found' })
		}

		res.json(doctor)
	})
})

// Get doctor schedule
router.get('/:id/schedule', verifyToken, (req, res) => {
	const { id } = req.params
	const { date } = req.query

	// Check if doctor exists
	db.get('SELECT * FROM doctors WHERE id = ?', [id], (err, doctor) => {
		if (err) {
			return res.status(500).json({ message: 'Database error' })
		}

		if (!doctor) {
			return res.status(404).json({ message: 'Doctor not found' })
		}

		// Get appointments for this doctor on given date
		db.all(
			'SELECT time FROM appointments WHERE doctor_id = ? AND date = ? AND status != ?',
			[id, date, 'CANCELLED'],
			(err, appointments) => {
				if (err) {
					return res.status(500).json({ message: 'Database error' })
				}

				// Available times (9:00 to 17:00 with 30-min slots)
				const allTimes = []
				for (let hour = 9; hour < 17; hour++) {
					allTimes.push(`${hour.toString().padStart(2, '0')}:00`)
					allTimes.push(`${hour.toString().padStart(2, '0')}:30`)
				}

				const bookedTimes = appointments.map(a => a.time)
				const availableTimes = allTimes.filter(
					time => !bookedTimes.includes(time),
				)

				res.json({
					doctorId: id,
					date,
					availableTimes,
					bookedTimes,
				})
			},
		)
	})
})

// Add new doctor (admin only)
router.post('/', verifyAdmin, (req, res) => {
	const { name, specialization, experience, phone } = req.body

	if (!name || !specialization) {
		return res.status(400).json({ message: 'Name and specialization required' })
	}

	db.run(
		'INSERT INTO doctors (name, specialization, experience, phone) VALUES (?, ?, ?, ?)',
		[name, specialization, experience || 0, phone || ''],
		function (err) {
			if (err) {
				return res.status(500).json({ message: 'Database error' })
			}

			res.status(201).json({
				id: this.lastID,
				name,
				specialization,
				experience: experience || 0,
				phone: phone || '',
			})
		},
	)
})

export default router
