# CareerLink - Job Portal

A full-stack job portal application with authentication functionality.

## Tech Stack

**Frontend:**
- React + Vite
- React Router
- Tailwind CSS
- Axios

**Backend:**
- Node.js + Express
- Prisma ORM
- MongoDB
- JWT Authentication
- bcryptjs

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file with your MongoDB connection string:
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/careerlink?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
```

4. Generate Prisma client:
```bash
node generate.js
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

## Features

- User registration and login
- JWT-based authentication
- Role-based access (user/admin)
- Protected routes
- Responsive design with Tailwind CSS
- Form validation and error handling