import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import connectDB from './utils/database';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT;

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // non-browser clients
    if (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl
  });
  next();
});

// Add request body logging for debugging
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    console.log('Request body:', req.body);
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'SkillSync Backend is running', docs: '/api/health' });
});
app.use('/api', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 SkillSync Backend running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/health`);
});

export default app;