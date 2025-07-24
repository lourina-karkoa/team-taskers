const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { authenticateToken, requireManager, logActivity } = require('../middlewares/auth.middleware');
const { validateProject } = require('../validation/project.validate');

// All routes require authentication
router.use(authenticateToken);

// Get all projects (accessible to all authenticated users)
router.get('/', getProjects);

// Get single project (accessible to all authenticated users)
router.get('/:id', validateObjectId, getProject);

// Manager-only routes
router.post('/', requireManager, validateProject, logActivity('CREATE_PROJECT', 'Project'), createProject);
router.put('/:id', requireManager, validateObjectId, validateProject, logActivity('project_updated', 'Project'), updateProject);
router.delete('/:id', requireManager, validateObjectId, logActivity('project_deleted', 'Project'), deleteProject);

module.exports = router;
