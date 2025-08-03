const express = require("express");
const router = express.Router();

const auth = require ("../middlewares/auth.middleware");
const role = require ("../middlewares/role.middleware")

const { getAllTaskes , getTaskById , createTask,updateTask,deleteTask } = require("../controllers/tasks.controller");
const { createTaskValidate, updateTaskValidate } = require("../validation/tasks.validate")


// Get
router.get("/", [auth, role(["Manager"])], getAllTaskes );

router.get("/:id", [auth, role(["TeamMember","Manager"])], getTaskById);


// Post
router.post("/add", [auth, role(["Manager"]),...createTaskValidate],createTask );


// Put
router.put("/update/:id", [auth, role(["TeamMember","Manager"]),...updateTaskValidate],updateTask );


// Delete
router.delete("/delete/:id", [auth, role(["Manager"])], deleteTask );



module.exports = router;