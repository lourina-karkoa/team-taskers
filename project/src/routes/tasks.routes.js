const express = require("express");
const router = express.Router();
const auth = require ("../middlewares/auth.middleware"); // verifyToken
const role = require ("../middlewares/role.middleware"); // verify-role
const TasksController = require("../controllers/tasks.controller"); // controller
// validation
const { getTaskByIdValidate,createTaskValidate, updateTaskValidate , deleteTaskValidate } = require("../validation/tasks.validate")


// Get
router.get("/", [auth, role(["Manager"])],TasksController.getAllTaskes );

router.get("/filterTasks",[auth, role(["Manager"])],TasksController.filterTasks);

router.get("/:id", [auth, role(["TeamMember","Manager"]), ...getTaskByIdValidate], TasksController.getTaskById);





// Post
// router.post("/add", [auth, role(["Manager"]),...createTaskValidate],TasksController.createTask );


// // Put
// router.put("/update-Status/:id", [auth, role(["Manager", "TeamMember"]), ...updateTaskValidate], TasksController.updateStatus);


// Delete
router.delete("/delete/:id", [auth, role(["Manager"]),...deleteTaskValidate], TasksController.deleteTask);

router.delete("/deleteAll", [auth, role(["Manager"])], TasksController.deleteAllTasks);


module.exports = router;