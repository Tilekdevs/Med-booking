# Med Booking Server

Node.js/Express сервер для приложения медицинского бронирования.

## 🚀 Быстрый старт

### Установка зависимостей

```bash
cd server
npm install
```

### Запуск сервера

```bash
npm start
```

Сервер будет запущен на `http://localhost:8085`

## 📋 API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход пользователя

### Врачи

- `GET /api/doctors` - Получить список врачей (требуется токен)
- `GET /api/doctors/:id` - Получить врача по ID (требуется токен)
- `GET /api/doctors/:id/schedule?date=YYYY-MM-DD` - Получить расписание врача
- `POST /api/doctors` - Добавить нового врача

### Записи

- `GET /api/appointments/my` - Получить записи текущего пользователя (требуется токен)
- `POST /api/appointments` - Создать новую запись (требуется токен)
- `PATCH /api/appointments/:id/cancel` - Отменить запись (требуется токен)

### Служебное

- `GET /api/health` - Проверка статуса сервера

## 🔐 Аутентификация

API использует JWT токены. Передавайте токен в заголовке:

```
Authorization: Bearer <your-token>
```

## 💾 База данных

Используется SQLite3. База данных автоматически создается при первом запуске в файле `medbooking.db`.

### Пример регистрации:

```bash
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John"}'
```

### Пример логина:

```bash
curl -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 📦 Структура проекта

```
server/
├── server.js              # Основной файл сервера
├── db.js                  # Инициализация базы данных
├── package.json           # Зависимости
├── middleware/
│   └── auth.js           # JWT аутентификация
└── routes/
    ├── auth.js           # Маршруты аутентификации
    ├── doctors.js        # Маршруты врачей
    └── appointments.js   # Маршруты записей
```

## 🛠️ Технологический стек

- Express.js - веб-фреймворк
- SQLite3 - база данных
- JWT - аутентификация
- Bcrypt - хеширование паролей
- CORS - кросс-доменные запросы
