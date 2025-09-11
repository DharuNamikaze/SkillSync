import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { 
  validateCreateProject, 
  validateUpdateProject, 
  validateProjectId,
  validateProjectQuery 
} from '../middleware/validation';

const router = Router();
const projectController = new ProjectController();

// Public routes
router.get('/', validateProjectQuery, projectController.getProjects);
router.get('/stats', projectController.getProjectStats);
router.get('/:id', validateProjectId, projectController.getProjectById);

// Protected routes
router.use(authenticateToken);

router.post('/', validateCreateProject, projectController.createProject);
router.get('/user/projects', projectController.getUserProjects);
router.put('/:id', validateProjectId, validateUpdateProject, projectController.updateProject);
router.delete('/:id', validateProjectId, projectController.deleteProject);
router.post('/:id/join', validateProjectId, projectController.joinProject);
router.post('/:id/leave', validateProjectId, projectController.leaveProject);

export default router;
