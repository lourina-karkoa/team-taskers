const express = require('express');
const router = express.Router();
///controller
const projectController = require('../controllers/project.controller');
////validation
const { validateProject } = require('./../validation/project.validate');
///middleware
const role = require('./../middlewares/role.middleware');
const auth = require('./../middlewares/auth.middleware');

////get all project
router.get( "/" ,[auth, role(["TeamMember","Manager"])],projectController.getAllProjects)

/////get project by id
router.get("/:id",[auth, role(["TeamMember","Manager"])] , projectController.getOneProject);



////add new project
router.post( "/add" ,[auth, role(["Manager"])], validateProject, projectController.addProject);

//////update project by id
router.put("/update/:id", [auth ,role (["Manager"])], validateProject,projectController.updateProject)

////////delete project by id
router.delete("/delete/:id",[auth , role(["Manager"])], projectController.deleteProject);

////////delete all project 
router.delete("/delete",[auth , role(["Manager"])], projectController.deleteAllProject);

module.exports = router;

