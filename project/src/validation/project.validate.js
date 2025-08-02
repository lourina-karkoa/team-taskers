const { body } = require('express-validator');
const handleValidationErrors = require("../middlewares/errorhandler.middleware")

// Project validation rules
const validateProject = [
    body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Project name must be between 3 and 100 characters'),
    
    body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
    
    body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
    
    body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
            throw new Error('End date must be after start date');
        }
        return true;
    }),
    
    body('status')
    .optional()
    .isIn(['planning', 'active', 'completed', 'on_hold'])
    .withMessage('Invalid project status'),
    
    body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array'),
   
    handleValidationErrors
];

module.exports = {
    validateProject
}