import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import connectDB from './utils/database';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
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