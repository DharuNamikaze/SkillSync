import express from 'express';
import session from 'express-session';
import cors from 'cors';
import mongoose from 'mongoose';
import  router  from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Session middleware
app.use(session({
  secret: process.env.JWT_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false
}));

// API routes
app.use('/api', router);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});