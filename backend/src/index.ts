import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import connectDB from './utils/database';
import { WebSocketService } from './services/webSocketService';

// Load environment variables
dotenv.config();

console.log('CODESANDBOX_API_KEY:', process.env.CODESANDBOX_API_KEY);

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Initialize WebSocket service for real-time features
const wsService = new WebSocketService(httpServer);

// Make WebSocket service available to routes
app.set('wsService', wsService);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow configured origins or localhost with any port
    if (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    if (
      req.method !== 'GET' &&
      req.body &&
      typeof req.body === 'object' &&
      Object.keys(req.body).length > 0
    ) {
      console.log('Body:', req.body);
    }
    next();
  });
}

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'SkillSync Backend is running', 
    version: '1.0.0',
    docs: '/api/health' 
  });
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
httpServer.listen(port, () => {
  console.log(`🚀 SkillSync Backend running on http://localhost:${port}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`📚 API Documentation at http://localhost:${port}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
