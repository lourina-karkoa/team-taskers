const express = require('express');
const router = express.Router();
///controller
const ProjectController = require('../controllers/project.controller');
////validation
const { 
    validateAddProject,
    validateUpdateProject
}   = require('../validation/project.validate');

///middleware
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const validateObjectId = require('../middlewares/validateObjectId.middleware');

////get all project
router.get( "/" ,[auth, role(["TeamMember","Manager"])],ProjectController.getAllProjects)

/////get project by id
router.get("/:id",[auth, role(["TeamMember","Manager"])] , ProjectController.getOneProject);



////add new project

router.post("/add",[auth,role(["Manager"]),...validateAddProject],ProjectController.addProject)



//////update project by id
router.put("/update/:id", [auth ,role (["Manager"]),validateObjectId("id"),...validateUpdateProject],ProjectController.updateProject)

////////delete project by id
router.delete("/delete/:id",[auth,role(["Manager"]),validateObjectId("id")], ProjectController.deleteProject);

////////delete all project 
router.delete("/delete",[auth , role(["Manager"])], ProjectController.deleteAllProject);

module.exports = router;

