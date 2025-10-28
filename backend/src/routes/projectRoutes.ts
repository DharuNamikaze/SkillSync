import { Router, Request, Response, NextFunction } from 'express';
import { ProjectController } from '../controllers/projectController';
import { ProjectChatController } from '../controllers/projectChatController';
import { authenticateToken } from '../middleware/auth';
import { 
  validateCreateProject, 
  validateUpdateProject, 
  validateProjectId,
  validateProjectQuery,
  validateMessageContent 
} from '../middleware/validation';

const router = Router();
const projectController = new ProjectController();

// Initialize chat controller
const chatController = new ProjectChatController();

// Protected routes - apply to all routes
router.use(authenticateToken);

// Project Chat Routes - must come before general project routes to avoid parameter conflicts
router.use('/:id/chat', (req: Request, res: Response, next: NextFunction) => {
  console.log('Project chat route middleware:', {
    method: req.method,
    params: req.params,
    query: req.query,
    path: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    headers: {
      authorization: req.headers.authorization ? 'present' : 'missing',
      'content-type': req.headers['content-type']
    }
  });
  next();
});

router.get('/:id/chat', validateProjectId, chatController.getMessages);
router.post('/:id/chat', validateProjectId, validateMessageContent, chatController.addMessage);
router.delete('/:id/chat/:messageId', validateProjectId, chatController.deleteMessage);

// Public project routes
router.get('/', validateProjectQuery, projectController.getProjects);
router.get('/stats', projectController.getProjectStats);
router.get('/user/projects', projectController.getUserProjects);

// Project CRUD routes
router.post('/', validateCreateProject, projectController.createProject);
router.get('/:id', validateProjectId, projectController.getProjectById);
router.put('/:id', validateProjectId, validateUpdateProject, projectController.updateProject);
router.delete('/:id', validateProjectId, projectController.deleteProject);
router.post('/:id/join', validateProjectId, projectController.joinProject);
router.post('/:id/leave', validateProjectId, projectController.leaveProject);

export default router;
