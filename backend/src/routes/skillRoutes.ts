import { Router } from 'express';
import { SkillController } from '../controllers/skillController';
import { authenticateToken } from '../middleware/auth';
import { 
  validateCreateSkill, 
  validateUpdateSkill, 
  validateSkillId 
} from '../middleware/validation';

const router = Router();
const skillController = new SkillController();

// All skill routes require authentication
router.use(authenticateToken);

// Skill CRUD operations
router.get('/', skillController.getUserSkills);
router.post('/', validateCreateSkill, skillController.createSkill);
router.get('/search', skillController.searchSkills);
router.get('/categories', skillController.getSkillCategories);
router.get('/category/:category', skillController.getSkillsByCategory);
router.get('/:id', validateSkillId, skillController.getSkillById);
router.put('/:id', validateSkillId, validateUpdateSkill, skillController.updateSkill);
router.delete('/:id', validateSkillId, skillController.deleteSkill);

export default router;
