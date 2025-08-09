const { body, param } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/Users");
const mongoose = require("mongoose");
const validate = require("../middlewares/validate.middleware");


// Validate task ID when getting a task by ID
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



// Validate task update input
const updateTaskValidate = [
  param("id")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Task ID is invalid. Please provide a valid task ID.");
      }
      return true;
    })
    .bail()
    .custom(async (value) => {
      const task = await Task.findById(value);
      if (!task) {
        throw new Error("Task not found. Please check the task ID and try again.");
      }
      return true;
    }),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["in_progress", "completed", "delayed"])
    .withMessage("Status must be one of: 'in_progress', 'completed', or 'delayed'."),

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
    .withMessage("Start date must be a valid ISO 8601 date (e.g., 2025-08-08).")
    ,

  body("dueDate")
    .if((value, { req }) => req.user.role === "Manager")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date (e.g., 2025-08-10).")
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
    .withMessage("Priority must be one of: 'low', 'medium', or 'high'."),

  validate,
];
// Validate task deletion by ID
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
  updateTaskValidate,
  deleteTaskValidate,
};
