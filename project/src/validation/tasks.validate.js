const { body, param } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/Users");
const mongoose = require("mongoose");
const validate = require("../middlewares/validate.middleware");

const getTaskByIdValidate = [
  param("id")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid task ID");
      }
      return true;
    })
    .bail()
    .custom(async (value, { req }) => {
      const task = await Task.findById(value);
      if (!task) {
        throw new Error("Task not found");
      }

      if (req.user.role === "TeamMember") {
        if (!task.assignedTo.equals(req.user.id)) {
          throw new Error("You are not allowed to access this task");
        }
      }

      return true;
    }),

  validate,
];

const createTaskValidate = [
  body("title").isString().withMessage("title must be string"),

  body("description").isString().withMessage("description must be string"),

  body("startDate").isISO8601().withMessage("Invalid date"),

  body("dueDate").isISO8601().withMessage("Invalid date")
  .bail()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("dueDate must be after startDate");
      }
      return true;
    }), 

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("status")
    .optional()
    .isIn(["in_progress", "completed", "delayed"])
    .withMessage("Invalid status"),

  body("projectId").custom(async (value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid projectId");
    }

    const project = await Project.findById(value);
    if (!project) {
      throw new Error("Project not found");
    }

    return true;
  }),

  body("assignedTo").custom(async (value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid userId");
    }

    const user = await User.findById(value);
    if (!user) {
      throw new Error("User not found");
    }

    return true;
  }),

  validate,
];

const updateTaskValidate = [
  param("id")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Task ID");
      }
      return true;
    })
    .bail()
    .custom(async (value) => {
      const task = await Task.findById(value);
      if (!task) {
        throw new Error("Task not found");
      }
      return true;
    }),

  body("status")
    .if((value, { req }) => req.user.role === "TeamMember" || req.user.role === "Manager")
    .notEmpty()
    .withMessage("Status is required")
    .bail()
    .isIn(["in_progress", "completed", "delayed"])
    .withMessage("Invalid status value"),

  body("title")
    .if((value, { req }) => req.user.role === "Manager")
    .optional()
    .isString()
    .withMessage("title must be string"),

  body("description")
    .if((value, { req }) => req.user.role === "Manager")
    .optional()
    .isString()
    .withMessage("description must be string"),

  body("startDate")
    .if((value, { req }) => req.user.role === "Manager")
    .optional()
    .isISO8601()
    .withMessage("Invalid date"),

  body("dueDate")
    .if((value, { req }) => req.user.role === "Manager")
    .optional()
    .isISO8601()
    .withMessage("Invalid date")
    .custom((value, { req }) => {
      if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("Due date must be after start date");
      }
      return true;
    }),

  body("priority")
    .if((value, { req }) => req.user.role === "Manager")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  validate,
];

const deleteTaskValidate = [
  param("id")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Task ID");
      }
      return true;
    })
    .bail()
    .custom(async (value) => {
      const user = await Task.findById(value);
      if (!user) {
        throw new Error("Task not found");
      }
      return true;
    }),

  validate,
];


module.exports = {
  getTaskByIdValidate,
  createTaskValidate,
  updateTaskValidate,
  deleteTaskValidate,
};
