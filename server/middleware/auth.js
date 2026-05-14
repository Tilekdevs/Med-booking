import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your-secret-key-change-this-in-production'

export function verifyToken(req, res, next) {
	const token = req.headers.authorization?.split(' ')[1]

	if (!token) {
		return res.status(401).json({ message: 'No token provided' })
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		req.userId = decoded.id
		req.userEmail = decoded.email
		req.userRole = decoded.role || 'USER'
		next()
	} catch (error) {
		return res.status(403).json({ message: 'Invalid or expired token' })
	}
}

export function verifyAdmin(req, res, next) {
	verifyToken(req, res, () => {
		if (req.userRole !== 'ADMIN') {
			return res.status(403).json({ message: 'Admin access required' })
		}
		next()
	})
}

export function generateToken(userId, email, role = 'USER') {
	return jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '7d' })
}
