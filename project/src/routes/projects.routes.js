const express = require('express');
const router = express.Router();
///controller
const projectController = require('./../controllers/projectController');
////validation
const { validateProject } = require('./../validation/project.validate');
///middleware
const role = require('./../middlewares/role.middleware');
const auth = require('./../middlewares/auth.middleware');

////get all project
router.get( "/" ,[auth, role(["TeamMember","Manager"])],projectController.getAllProjects)

////add new project
router.post( "/add" ,[auth, role(["Manager"])], validateProject, projectController.addProject);

// Get single project (accessible to all authenticated users)
router.get('/:id',validateObjectId, getProject);

//////update project by id
router.put("/update/:id", [auth ,role (["Manager"])], validateProject,projectController.updateProject)

////////delete project by id
router.delete("/delete/:id",[auth , role(["Manager"])], projectController.deleteProject);

module.exports = router;

