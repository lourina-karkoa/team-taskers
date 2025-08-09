const { body, param, validationResult } = require('express-validator');
const Project = require('./../models/Project');

const validateProject = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),

  body('startDate')
    .optional()
    .isISO8601().withMessage('Invalid startDate')
    .toDate()
    .custom((startDate, { req }) => {
      if (req.body.endDate) {
        const rawEnd = req.body.endDate;
        const end = rawEnd instanceof Date ? rawEnd : new Date(rawEnd);

        if (isNaN(end.getTime())) {
          return true;
        }

        if (startDate > end) {
          throw new Error('Start date cannot be after end date');
        }
      }
      return true;
    }),

  body('endDate')
    .optional()
    .isISO8601().withMessage('Invalid endDate')
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
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