import path, { dirname } from 'path'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DB_PATH = path.join(__dirname, 'medbooking.db')

let db = null

export function getDb() {
	if (!db) {
		db = new sqlite3.Database(DB_PATH, err => {
			if (err) {
				console.error('Database connection error:', err)
			} else {
				console.log('✅ Connected to SQLite database')
			}
		})
	}
	return db
}

export async function initDatabase() {
	return new Promise((resolve, reject) => {
		const database = getDb()

		database.serialize(() => {
			// Users table
			database.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          role TEXT DEFAULT 'USER',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

			// Doctors table
			database.run(`
        CREATE TABLE IF NOT EXISTS doctors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          specialization TEXT NOT NULL,
          experience INTEGER,
          phone TEXT,
          schedule TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

			// Appointments table
			database.run(
				`
        CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          doctor_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          status TEXT DEFAULT 'SCHEDULED',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        )
      `,
				err => {
					if (err) {
						console.error('Database init error:', err)
						reject(err)
					} else {
						console.log('📦 Database tables created/verified')
						resolve()
					}
				},
			)

			// Insert sample doctors if table is empty
			database.get('SELECT COUNT(*) as count FROM doctors', (err, row) => {
				if (!err && row.count === 0) {
					const sampleDoctors = [
						{
							name: 'Иван Петров',
							specialization: 'Кардиолог',
							experience: 10,
							phone: '+7-999-123-4567',
						},
						{
							name: 'Мария Сидорова',
							specialization: 'Невролог',
							experience: 8,
							phone: '+7-999-234-5678',
						},
						{
							name: 'Алексей Иванов',
							specialization: 'Ортопед',
							experience: 12,
							phone: '+7-999-345-6789',
						},
					]

					sampleDoctors.forEach(doctor => {
						database.run(
							'INSERT INTO doctors (name, specialization, experience, phone) VALUES (?, ?, ?, ?)',
							[
								doctor.name,
								doctor.specialization,
								doctor.experience,
								doctor.phone,
							],
						)
					})
					console.log('🏥 Sample doctors inserted')
				}
			})
		})
	})
}
