import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

// Public dashboard stats (general statistics)
router.get('/stats', dashboardController.getDashboardStats);

// Protected routes (user-specific data)
router.get('/activities', authenticateToken, dashboardController.getRecentActivities);
router.get('/tasks', authenticateToken, dashboardController.getUpcomingTasks);
router.get('/skills', authenticateToken, dashboardController.getSkillProgress);

export default router;