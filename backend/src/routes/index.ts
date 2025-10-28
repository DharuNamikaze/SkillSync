import { Router } from 'express';
import userRoutes from './userRoutes';
import skillRoutes from './skillRoutes';
import projectRoutes from './projectRoutes';
import notificationRoutes from './notificationRoutes';
import dashboardRoutes from './dashboardRoutes';
import authRoutes from './authRoutes';
import messageRoutes from './messageRoutes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'SkillSync API is running',
    timestamp: new Date().toISOString()
  });
});

// Route debugging middleware
router.use((req, res, next) => {
  console.log('Main router hit:', {
    path: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl
  });
  next();
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/projects', projectRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/messages', messageRoutes);

export default router;
