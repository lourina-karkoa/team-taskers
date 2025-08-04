
const { body } = require('express-validator');
const { validationResult } = require('express-validator');

const validateProject = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
  body('startDate').optional().isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateProject };