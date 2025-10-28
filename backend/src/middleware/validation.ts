import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param, query } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', {
      path: req.path,
      body: req.body,
      errors: errors.array()
    });
    return res.status(400).json({
      ok: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateCreateUser = [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('picture').optional().isURL(),
  body('googleId').optional().isString(),
  handleValidationErrors
];

export const validateUpdateUser = [
  body('bio').optional().isLength({ max: 500 }),
  body('title').optional().isLength({ max: 100 }),
  body('socialLinks.github').optional().isURL(),
  body('socialLinks.linkedin').optional().isURL(),
  handleValidationErrors
];

// Skill validation rules
export const validateCreateSkill = [
  body('name').trim().isLength({ min: 1, max: 50 }),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  body('category').trim().isLength({ min: 1, max: 50 }),
  handleValidationErrors
];

export const validateUpdateSkill = [
  body('name').optional().trim().isLength({ min: 1, max: 50 }),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  body('category').optional().trim().isLength({ min: 1, max: 50 }),
  handleValidationErrors
];

export const validateSkillId = [
  param('id').isMongoId(),
  handleValidationErrors
];

// Project validation rules
export const validateCreateProject = [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('description').trim().isLength({ min: 1, max: 1000 }),
  body('technologies').isArray(),
  body('maxMembers').isInt({ min: 1, max: 50 }),
  body('deadline').isISO8601().toDate(),
  body('department').trim().isLength({ min: 1, max: 50 }),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
  body('tags').optional().isArray(),
  body('templateId').isString().notEmpty(),
  body('sandboxTemplate').isString().notEmpty(),
  body('isPublic').isBoolean().optional().default(true),
  handleValidationErrors
];

export const validateUpdateProject = [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('status').optional().isIn(['planning', 'recruiting', 'active', 'completed', 'paused']),
  body('technologies').optional().isArray(),
  body('maxMembers').optional().isInt({ min: 1, max: 50 }),
  body('deadline').optional().isISO8601().toDate(),
  body('department').optional().trim().isLength({ min: 1, max: 50 }),
  body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('tags').optional().isArray(),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  handleValidationErrors
];

export const validateProjectId = [
  (req: Request, res: Response, next: NextFunction) => {
    console.log('validateProjectId middleware:', {
      params: req.params,
      path: req.path,
      baseUrl: req.baseUrl,
      originalUrl: req.originalUrl
    });
    next();
  },
  param('id').isMongoId(),
  handleValidationErrors
];

// Chat validation rules
export const validateMessageContent = [
  body('message').trim().isLength({ min: 1, max: 2000 }),
  body('userName').trim().isLength({ min: 1, max: 100 }),
  body('userAvatar').optional().isString(),  // Made optional and just require it to be a string
  body('type').optional().isIn(['text', 'system', 'code']),
  body('codeBlock').optional().isObject(),
  body('codeBlock.language').optional().isString(),
  body('codeBlock.content').optional().isString(),
  handleValidationErrors
];

// Query validation
export const validateProjectQuery = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim().isLength({ max: 100 }),
  query('status').optional().isIn(['planning', 'recruiting', 'active', 'completed', 'paused']),
  query('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  handleValidationErrors
];

export const validateNotificationQuery = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('filter').optional().isIn(['all', 'projects', 'tasks', 'comments', 'team', 'system']),
  query('unreadOnly').optional().isBoolean(),
  handleValidationErrors
];

export const validateNotificationId = [
  param('id').isMongoId(),
  handleValidationErrors
];

// Message validation rules
export const validatePartnerId = [
  param('partnerId').isMongoId().withMessage('Invalid partner ID'),
  handleValidationErrors
];

export const validateMessage = [
  body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Message content is required and must be between 1 and 5000 characters'),
  handleValidationErrors
];
