import bcrypt from 'bcrypt'
import express from 'express'
import { getDb } from '../db.js'
import { generateToken } from '../middleware/auth.js'

const router = express.Router()
const db = getDb()

// Register
router.post('/register', async (req, res) => {
	const { email, password, name } = req.body

	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password required' })
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10)

		db.run(
			'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
			[email, hashedPassword, name || email],
			function (err) {
				if (err) {
					if (err.message.includes('UNIQUE constraint failed')) {
						return res.status(400).json({ message: 'Email already registered' })
					}
					return res.status(500).json({ message: 'Database error' })
				}

				const token = generateToken(this.lastID, email, 'USER')
				res.status(201).json({
					token,
					user: { id: this.lastID, email, name: name || email, role: 'USER' },
				})
			},
		)
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
})

// Login
router.post('/login', (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password required' })
	}

	db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
		if (err) {
			return res.status(500).json({ message: 'Database error' })
		}

		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password' })
		}

		try {
			const passwordMatch = await bcrypt.compare(password, user.password)

			if (!passwordMatch) {
				return res.status(401).json({ message: 'Invalid email or password' })
			}

			const token = generateToken(user.id, user.email)
			res.json({
				token,
				user: { id: user.id, email: user.email, name: user.name },
			})
		} catch (error) {
			res.status(500).json({ message: 'Server error' })
		}
	})
})

export default router
