const express = require("express");
const router = express.Router();
const auth = require ("../middlewares/auth.middleware");
const role = require ("../middlewares/role.middleware")
const TasksController = require("../controllers/tasks.controller");
const { getTaskByIdValidate,createTaskValidate, updateTaskValidate , deleteTaskValidate } = require("../validation/tasks.validate")


// Get
router.get("/", [auth, role(["Manager"])],TasksController.getAllTaskes );


router.get("/:id", [auth, role(["TeamMember","Manager"]), ...getTaskByIdValidate], TasksController.getTaskById);


// Post
router.post("/add", [auth, role(["Manager"]),...createTaskValidate],TasksController.createTask );


// Put
router.put("/:id", [auth, role(["Manager", "TeamMember"]), ...updateTaskValidate], TasksController.updateTask);


// Delete
router.delete("/:id", [auth, role(["Manager"]),...deleteTaskValidate], TasksController.deleteTask);

router.delete("/", [auth, role(["Manager"])], TasksController.deleteAllTasks);


module.exports = router;