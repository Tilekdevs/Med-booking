import express from 'express'
import { getDb } from '../db.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()
const db = getDb()

// Get user's appointments
router.get('/my', verifyToken, (req, res) => {
	const userId = req.userId

	db.all(
		`SELECT 
      a.id, 
      a.user_id, 
      a.doctor_id, 
      a.date, 
      a.time, 
      a.status, 
      d.name as doctor_name,
      d.specialization
     FROM appointments a
     JOIN doctors d ON a.doctor_id = d.id
     WHERE a.user_id = ?
     ORDER BY a.date DESC, a.time DESC`,
		[userId],
		(err, appointments) => {
			if (err) {
				return res.status(500).json({ message: 'Database error' })
			}
			res.json(appointments || [])
		},
	)
})

// Create appointment
router.post('/', verifyToken, (req, res) => {
	const { doctorId, date, time, status } = req.body
	const userId = req.userId

	if (!doctorId || !date || !time) {
		return res
			.status(400)
			.json({ message: 'Doctor ID, date, and time are required' })
	}

	// Validate date format (YYYY-MM-DD)
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return res
			.status(400)
			.json({ message: 'Invalid date format. Use YYYY-MM-DD' })
	}

	// Validate time format (HH:MM)
	if (!/^\d{2}:\d{2}$/.test(time)) {
		return res.status(400).json({ message: 'Invalid time format. Use HH:MM' })
	}

	// Check if doctor exists
	db.get('SELECT id FROM doctors WHERE id = ?', [doctorId], (err, doctor) => {
		if (err) {
			return res.status(500).json({ message: 'Database error' })
		}

		if (!doctor) {
			return res.status(404).json({ message: 'Doctor not found' })
		}

		// Check if time slot is available
		db.get(
			'SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status != ?',
			[doctorId, date, time, 'CANCELLED'],
			(err, existingAppointment) => {
				if (err) {
					return res.status(500).json({ message: 'Database error' })
				}

				if (existingAppointment) {
					return res
						.status(409)
						.json({ message: 'Time slot is already booked' })
				}

				// Create appointment
				db.run(
					'INSERT INTO appointments (user_id, doctor_id, date, time, status) VALUES (?, ?, ?, ?, ?)',
					[userId, doctorId, date, time, status || 'SCHEDULED'],
					function (err) {
						if (err) {
							return res.status(500).json({ message: 'Database error' })
						}

						res.status(201).json({
							id: this.lastID,
							user_id: userId,
							doctor_id: doctorId,
							date,
							time,
							status: status || 'SCHEDULED',
						})
					},
				)
			},
		)
	})
})

// Cancel appointment
router.patch('/:id/cancel', verifyToken, (req, res) => {
	const { id } = req.params
	const userId = req.userId

	// Verify user owns this appointment
	db.get(
		'SELECT id FROM appointments WHERE id = ? AND user_id = ?',
		[id, userId],
		(err, appointment) => {
			if (err) {
				return res.status(500).json({ message: 'Database error' })
			}

			if (!appointment) {
				return res.status(404).json({ message: 'Appointment not found' })
			}

			db.run(
				'UPDATE appointments SET status = ? WHERE id = ?',
				['CANCELLED', id],
				err => {
					if (err) {
						return res.status(500).json({ message: 'Database error' })
					}

					res.json({ message: 'Appointment cancelled successfully' })
				},
			)
		},
	)
})

export default router
