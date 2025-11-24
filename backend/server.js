require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

const parseOrigins = (value) =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const clientUrlEnv = process.env.CLIENT_URL;
const defaultDevOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

const isDev = process.env.NODE_ENV !== 'production';

const corsOrigin =
  isDev || !clientUrlEnv || clientUrlEnv === '*'
    ? (origin, callback) => callback(null, true)
    : [...parseOrigins(clientUrlEnv), ...defaultDevOrigins];

app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

app.use(express.json());

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// =================== AUTH ROUTES ===================== //

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Backwards-compatible signup route for frontends calling POST /signup
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await prisma.user.create({ data: { name, email, password: hashedPassword, role } });

    return res.status(201).json({ success: true, message: 'User created' });
  } catch (error) {
    console.error('Error in /signup:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ error: 'Invalid credentials' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// =================== JOB ROUTES ===================== //

// Get all jobs (pagination + filters)
app.get('/api/jobs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { type, location, search } = req.query;

    const where = {};
    if (type) where.type = type;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single job
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });

    if (!job) return res.status(404).json({ error: 'Job not found' });

    const poster = await prisma.user.findUnique({
      where: { id: job.postedBy },
      select: { name: true, email: true }
    });

    res.json({ ...job, postedByUser: poster });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create job
app.post('/api/jobs', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'poster')
      return res.status(403).json({ error: 'Only job posters can create jobs' });

    const { title, company, location, type, salary, description, requirements } = req.body;

    if (!title || !company || !location || !type || !description)
      return res.status(400).json({ error: 'Missing required fields' });

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        salary: salary || 'Not specified',
        description,
        requirements: requirements || '',
        postedBy: req.user.userId
      }
    });

    const poster = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { name: true, email: true }
    });

    res.status(201).json({ ...job, postedByUser: poster });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update job
app.put('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });

    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.postedBy !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not authorized' });

    const updatedJob = await prisma.job.update({
      where: { id: req.params.id },
      data: req.body
    });

    const poster = await prisma.user.findUnique({
      where: { id: updatedJob.postedBy },
      select: { name: true, email: true }
    });

    res.json({ ...updatedJob, postedByUser: poster });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete job
app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });

    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.postedBy !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not authorized' });

    await prisma.job.delete({ where: { id: req.params.id } });

    res.json({ message: 'Job deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/jobs/posted/my', authenticateToken, async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { postedBy: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await prisma.application.count({ where: { jobId: job.id } });
        return { ...job, applicationCount: count };
      })
    );

    res.json(jobsWithCounts);
  } catch (error) {
    console.error('Error fetching posted jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =================== APPLICATION ROUTES ===================== //

// Apply to a job
app.post('/api/jobs/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.id;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const existingApplication = await prisma.application.findFirst({
      where: { jobId, userId: req.user.userId }
    });

    if (existingApplication)
      return res.status(400).json({ error: 'Already applied to this job' });

    const application = await prisma.application.create({
      data: {
        jobId,
        userId: req.user.userId,
        coverLetter: coverLetter || ''
      }
    });

    const jobDetails = await prisma.job.findUnique({ where: { id: jobId } });
    const applicant = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { name: true, email: true }
    });

    res.status(201).json({ ...application, job: jobDetails, user: applicant });
  } catch (error) {
    console.error('Error applying:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/jobs/:id/applications', authenticateToken, async (req, res) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.postedBy !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not authorized' });

    const applications = await prisma.application.findMany({
      where: { jobId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });

    const detailed = await Promise.all(
      applications.map(async (app) => {
        const user = await prisma.user.findUnique({
          where: { id: app.userId },
          select: { id: true, name: true, email: true }
        });
        return { ...app, applicant: user };
      })
    );

    res.json(detailed);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/applications/:id', authenticateToken, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    const job = await prisma.job.findUnique({ where: { id: application.jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.postedBy !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not authorized' });

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { status: req.body.status || 'pending' }
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/applications/:id', authenticateToken, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    const job = await prisma.job.findUnique({ where: { id: application.jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.postedBy !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not authorized' });

    await prisma.application.delete({ where: { id: req.params.id } });
    res.json({ message: 'Application deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get logged-in user's applications
app.get('/api/applications/my', authenticateToken, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    const apps = await Promise.all(
      applications.map(async (app) => {
        const job = await prisma.job.findUnique({ where: { id: app.jobId } });
        return { ...app, job };
      })
    );

    res.json(apps);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// =================== SAVED JOBS ROUTES ===================== //

// Save job
app.post('/api/jobs/:id/save', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const existingSave = await prisma.savedJob.findFirst({
      where: { jobId, userId: req.user.userId }
    });

    if (existingSave)
      return res.status(400).json({ error: 'Job already saved' });

    const savedJob = await prisma.savedJob.create({
      data: { jobId, userId: req.user.userId }
    });

    const jobDetails = await prisma.job.findUnique({ where: { id: jobId } });
    const poster = await prisma.user.findUnique({
      where: { id: jobDetails.postedBy },
      select: { name: true, email: true }
    });

    res.status(201).json({ ...savedJob, job: { ...jobDetails, postedByUser: poster } });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unsave job
app.delete('/api/jobs/:id/save', authenticateToken, async (req, res) => {
  try {
    const savedJob = await prisma.savedJob.findFirst({
      where: { jobId: req.params.id, userId: req.user.userId }
    });

    if (!savedJob)
      return res.status(404).json({ error: 'Saved job not found' });

    await prisma.savedJob.delete({ where: { id: savedJob.id } });

    res.json({ message: 'Job unsaved successfully' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's saved jobs
app.get('/api/jobs/saved/my', authenticateToken, async (req, res) => {
  try {
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    const jobs = await Promise.all(
      savedJobs.map(async (sj) => {
        const job = await prisma.job.findUnique({ where: { id: sj.jobId } });
        const poster = await prisma.user.findUnique({
          where: { id: job.postedBy },
          select: { name: true, email: true }
        });
        return { ...job, postedByUser: poster };
      })
    );

    res.json(jobs);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if job saved
app.get('/api/jobs/:id/saved', authenticateToken, async (req, res) => {
  try {
    const savedJob = await prisma.savedJob.findFirst({
      where: { jobId: req.params.id, userId: req.user.userId }
    });

    res.json({ saved: !!savedJob });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// =================== SERVER START ===================== //

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
