import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { 
  validateCreateUser, 
  validateUpdateUser 
} from '../middleware/validation';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/upsert', validateCreateUser, userController.createOrUpdateUser);

// Protected routes
router.get('/profile', authenticateToken, userController.getUserProfile);
router.put('/profile', authenticateToken, validateUpdateUser, userController.updateUserProfile);
router.delete('/profile', authenticateToken, userController.deleteUser);

// Admin routes (optional auth for now)
router.get('/', optionalAuth, userController.getAllUsers);

export default router;
