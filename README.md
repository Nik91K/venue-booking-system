# Table Booking System

A full-featured table booking system for restaurants and establishments, allowing users to reserve tables, leave comments, and manage their bookings.

## Features

- Browse and search establishments
- Reserve tables at restaurants
- Leave reviews and comments
- User authentication and profile management
- Automated avatar generation using DiceBear API
- Secure JWT-based authentication

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure it

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your configuration:

   ```env
   # Database Configuration
   DB_TYPE=postgres
   DB_HOST=localhost          # Your database host
   DB_PORT=5432              # Your database port
   DB_USERNAME=your_username # Your database username
   DB_PASSWORD=your_password # Your database password
   DB_DATABASE=booking_db    # Your database name

   # JWT Configuration
   JWT_ACCESS_SECRET=your_secure_access_secret_here
   JWT_REFRESH_SECRET=your_secure_refresh_secret_here
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   ```

4. **Initialize the database**

   This command will delete the existing database, recreate it, and seed it with sample data (users, establishments, comments, etc...)

   ```bash
   npm run seed
   ```

   > ⚠️ **Warning**: `npm run seed` will delete all existing data in your database!

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## Database Seeding

```bash
npm run seed
```

## Avatar Generation

The application uses the [DiceBear API](https://api.dicebear.com/) to generate unique avatars for users. Avatars are generated using the "thumbs" style:

```typescript
https://api.dicebear.com/7.x/thumbs/svg?seed={unique_seed}
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Establishments

- `GET /establishments` - Get all establishments
- `GET /establishments/:id` - Get establishment by ID
- `POST /establishments` - Create new establishment (admin)

### Bookings

- `GET /bookings` - Get user's bookings
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

### Comments

- `GET /establishments/:id/comments` - Get establishment comments
- `POST /establishments/:id/comments` - Add comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

## Environment Variables Reference

| Variable                 | Description               | Example                |
| ------------------------ | ------------------------- | ---------------------- |
| `DB_TYPE`                | Database type             | `postgres`             |
| `DB_HOST`                | Database host address     | `localhost`            |
| `DB_PORT`                | Database port             | `5432`                 |
| `DB_USERNAME`            | Database username         | `postgres`             |
| `DB_PASSWORD`            | Database password         | `your_password`        |
| `DB_DATABASE`            | Database name             | `booking_db`           |
| `JWT_ACCESS_SECRET`      | Secret for access tokens  | `random_secure_string` |
| `JWT_REFRESH_SECRET`     | Secret for refresh tokens | `random_secure_string` |
| `JWT_ACCESS_EXPIRES_IN`  | Access token expiry       | `15m`                  |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry      | `7d`                   |
