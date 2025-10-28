import { Router } from 'express';
import userRoutes from './userRoutes';
import skillRoutes from './skillRoutes';
import projectRoutes from './projectRoutes';
import notificationRoutes from './notificationRoutes';
import dashboardRoutes from './dashboardRoutes';
import authRoutes from './authRoutes';
import projectChatRoutes from '../routes/projectChatRoutes';
const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'SkillSync API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/projects', projectRoutes);
router.use('/projects', projectChatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
