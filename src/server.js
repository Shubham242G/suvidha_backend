import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(helmet());

/* ============================================================
   CORS — supports explicit origins + wildcard vercel.app
   ============================================================ */
const explicitOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // curl / Postman / server-to-server

  // exact match
  if (explicitOrigins.includes(origin)) return true;

  // allow any *.vercel.app (covers preview + production)
  if (/^https:\/\/[a-z0-9-]+(\.vercel\.app)$/i.test(origin)) return true;

  // allow custom domain subdomains later, e.g. suvidha.services
  if (/^https:\/\/(www\.)?suvidha\.services$/i.test(origin)) return true;

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Explicitly respond to preflight OPTIONS
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Suvidha API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   Allowed origins: ${explicitOrigins.join(', ')} (+ *.vercel.app)`);
  });
};

start();