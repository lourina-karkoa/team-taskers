const { body } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require ("../models/Users");
const validate = require("../middlewares/validate.middleware");


const createTaskValidate = [
  body("title")
    .isString().withMessage("title must be string"),

  body("description")
    .isString().withMessage("description must be string"),

  body("dueDate")
    .isISO8601().withMessage("Invalid date"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),

  body("status")
    .optional()
    .isIn(["in_progress", "completed", "delayed"]).withMessage("Invalid status"),

  body("projectId")
    .custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
             throw new Error("Invalid projectId");
        }

        const project = await Project.findById(value);
        if (!project) {
            throw new Error("Project not found");
        }

        return true;
    }),


  body("assignedTo")
    .custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
             throw new Error("Invalid userId");
        }

        const user = await User.findById(value);
        if (!user) {
            throw new Error("User not found");
        }

        return true;
    }),


  validate
];

const updateTaskValidate = [
  body("title").optional().isString().withMessage("title must be string"),
  body("description").optional().isString().withMessage("description must be string"),
  body("dueDate").optional().isISO8601().withMessage("Invalid date"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("status").optional().isIn(["in_progress", "completed", "delayed"]).withMessage("Invalid status"),
  body("projectId").optional()
    .custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
             throw new Error("Invalid projectId");
        }

        const project = await Project.findById(value);
        if (!project) {
            throw new Error("Project not found");
        }

        return true;
    }),
  body("assignedTo").optional()
     .custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
             throw new Error("Invalid userId");
        }

        const user = await User.findById(value);
        if (!user) {
            throw new Error("User not found");
        }

        return true;
     }),
  validate
];



module.exports = {
  createTaskValidate,
  updateTaskValidate
};
