
Frontend Url=> job-portal-five-henna.vercel.app
Backend Url=> https://jobportal-fkdm.onrender.com


Project Title: CareerLink – Job Portal Site


Problem Statement:
Finding and applying for jobs is often fragmented across multiple platforms, making it difficult for job
seekers and recruiters to connect efficiently. CareerLink aims to simplify this process by providing a
unified platform where employers can post job openings, and job seekers can browse, apply, and
track their applications easily.
System Architecture:
Frontend → Backend (API) → Database
Frontend: React.js with React Router for page navigation
Backend: Node.js + Express
Database: MongoDB (non-relational) / PostgreSQL (relational)
Authentication: JWT-based login/signup
Hosting:
Frontend → Netlify/Vercel
Backend → Render/Railway
Database → MongoDB Atlas / ElephantSQL / Aiven
Key Features:

Category | Features
Authentication & Authorization — User registration, login, logout, role-based access (admin/user)
CRUD Operations — Create, read, update, delete job listings and user data
Frontend Routing — Pages: Home, Login, Dashboard, Job Details, Profile, Post Job
Job Management — Recruiters can post, edit, and delete jobs
Application System — Job seekers can apply for jobs and track their status
Data Operations — Searching, sorting, filtering, and pagination of job listings for efficient data handling
Hosting — Deployed on Vercel (frontend) and Render (backend) with MongoDB Atlas
=======
# CareerLink - Modern Job Portal

A fully modern, beautiful dark-mode job portal application with premium UI, smooth animations, and comprehensive job management features.

## 🎨 Features

### Design
- **Dark Mode UI** - Premium dark theme with neon accents (cyan, teal, purple)
- **Glassmorphism** - Modern glass-effect cards and components
- **Smooth Animations** - Framer Motion powered page transitions and micro-interactions
- **Responsive Design** - Fully responsive for mobile, tablet, and desktop
- **Modern Typography** - Clean, readable fonts with gradient text effects

### User Types

#### Job Poster (Admin/Poster Role)
- Create new job postings
- Edit existing job posts
- Delete job posts
- View all posted jobs with application counts
- Dashboard with statistics

#### Job Seeker (User Role)
- Browse all available jobs
- Advanced filtering (type, location, search)
- Pagination with smooth animations
- Save jobs for later
- Apply to jobs with cover letter
- View job details in beautiful modal

### Technical Stack

**Frontend:**
- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- Framer Motion (animations)
- Lucide React (icons)
- Axios (API calls)

**Backend:**
- Node.js + Express
- Prisma ORM
- MongoDB
- JWT Authentication
- bcryptjs (password hashing)

## 🚀 Setup Instructions
>>>>>>> fix-branch




Tech Stack:
Frontend: React.js, React Router, Axios, TailwindCSS/Bootstrap
Backend: Node.js, Express.js
Database: MongoDB / PostgreSQL
Authentication: JWT / OAuth
Hosting: Vercel, Render, Netlify, Railway
API Overview:
/api/auth/signup – Register new user (Public)
/api/auth/login – Authenticate user (Public)
/api/jobs – Get all job listings (Authenticated)
/api/jobs/:id – Update job listing (Authenticated)
/api/jobs/:id – Delete job listing (Admin only)
=======
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
DATABASE_URL="mongodb+srv://deepanshu26:deepanshu26@jobportal.dtmtqnc.mongodb.net/JobPortal?appName=JobPortal"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
CLIENT_URL="http://localhost:5173"
```

4. Push Prisma schema to database:
```bash
npx prisma db push
```

5. Generate Prisma client:
```bash
node generate.js
```

6. Start the server:
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

3. Create `.env` file in frontend directory (optional):
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
job portal/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── server.js              # Express server & API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── JobForm.jsx
│   │   │   └── JobDetail.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PosterDashboard.jsx
│   │   │   └── EmployeeDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── App.jsx             # Main app component
│   │   └── index.css           # Global styles
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Jobs
- `GET /api/jobs` - Get all jobs (with pagination & filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Poster only)
- `PUT /api/jobs/:id` - Update job (Poster only, own jobs)
- `DELETE /api/jobs/:id` - Delete job (Poster only, own jobs)
- `GET /api/jobs/posted/my` - Get jobs posted by current user

### Applications
- `POST /api/jobs/:id/apply` - Apply to job
- `GET /api/applications/my` - Get user's applications

### Saved Jobs
- `POST /api/jobs/:id/save` - Save job
- `DELETE /api/jobs/:id/save` - Unsave job
- `GET /api/jobs/saved/my` - Get user's saved jobs
- `GET /api/jobs/:id/saved` - Check if job is saved

## 🎨 Color Palette

- **Background**: `#0D0F13` (Deep charcoal)
- **Primary Accent**: `#00F0FF` (Neon cyan/teal)
- **Secondary Accent**: `#A78BFA` (Purple)
- **Text**: Soft white/gray
- **Cards**: Semi-transparent glass effect with backdrop blur

## ✨ Key Features

- **Smooth Page Transitions** - Animated route changes
- **Micro-interactions** - Hover effects, button animations
- **Glassmorphism** - Modern glass-effect UI
- **Gradient Text** - Beautiful gradient text effects
- **Responsive Pagination** - Smooth animated page transitions
- **Real-time Updates** - Instant UI updates on actions
- **Error Handling** - User-friendly error messages
- **Loading States** - Beautiful loading indicators

## 🔐 User Roles

- **user** - Job Seeker (default)
- **admin** or **poster** - Job Poster

When signing up, users can choose their role:
- Job Seeker - Can browse, save, and apply to jobs
- Job Poster - Can create, edit, and delete job postings

## 🚀 Deployment

### Backend
1. Set environment variables in production
2. Update `DATABASE_URL` to production MongoDB
3. Set secure `JWT_SECRET`
4. Update `CLIENT_URL` to production frontend URL
5. Deploy to your hosting service (Heroku, Railway, etc.)

### Frontend
1. Set `VITE_API_URL` to production backend URL
2. Build for production: `npm run build`
3. Deploy `dist` folder to hosting service (Vercel, Netlify, etc.)

## 📝 Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 24 hours
- All API routes except auth require authentication
- Job posters can only edit/delete their own jobs
- MongoDB is used as the database (Prisma ORM)

## 🎉 Enjoy!

Your modern job portal is ready! Start by creating an account and exploring the beautiful UI.
>>>>>>> fix-branch
