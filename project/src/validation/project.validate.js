const { body, param, validationResult } = require('express-validator');
const Project = require('./../models/Project');



const validateProject = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
  body('startDate').optional().isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate(),
];

const validateProjectId = [
  param('id')
    .notEmpty().withMessage('Project ID is required')
    .isMongoId().withMessage('Invalid project ID')
    .custom(async (projectId) => {
      const project = await Project.findById(projectId);
      if (!project) {
        return Promise.reject('Project not found');
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateProject, validateProjectId };
