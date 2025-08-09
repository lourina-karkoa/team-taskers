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
// Validate task creation input
const createTaskValidate = [
  // Validate that title && description is a string
  body("title")
    .isString().withMessage("The task title must be a string (text)."),
  body("projectId")
    .custom(async (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Project ID is invalid. Please provide a valid MongoDB ObjectId.");
      }

      const project = await Project.findById(value);
      if (!project) {
        throw new Error("The specified project does not exist.");
      }

      return true;
    }),
  body("description")
    .isString().withMessage("The task description must be a string (text)."),
// Validate that startDate && dueDate is a valid ISO 8601 date
  body("startDate")
    .isISO8601().withMessage("Start date must be a valid ISO 8601 date (e.g., 2025-08-08).")
    .custom(async(value,{req})=>{
        const exist = await Project.findById(req.body.projectId);
        if(exist.startDate > new Date(value) || exist.endDate < new Date(value)){
            throw new Error("startDate must be between the start and end time of the project.");
        }
        return true
    }),

  body("dueDate")
    .isISO8601().withMessage("Due date must be a valid ISO 8601 date (e.g., 2025-08-10).")
    .bail()
    .custom(async(value, { req }) => {
       const exist = await Project.findById(req.body.projectId);
        if(exist.startDate > new Date(value) || exist.endDate < new Date(value)){
            throw new Error("dueDate must be between the start and end time of the project.");
        }
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("Due date must be after the start date.");
      }
      return true;
    }),
  // Optional: Check if priority is one of the allowed values
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of the following values: 'low', 'medium', or 'high'."),
  // Optional: Check if status is valid
  body("status")
    .optional()
    .isIn(["in_progress", "completed", "delayed"])
    .withMessage("Status must be one of: 'in_progress', 'completed', or 'delayed'."),

  // Validate that projectId is a valid MongoDB ObjectId and exists

 // Validate that assignedTo is a valid user ID and exists
  body("assignedTo")
    .custom(async (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("User ID is invalid. Please provide a valid MongoDB ObjectId.");
      }

      const user = await User.findById(value);
      if (!user) {
        throw new Error("The specified user does not exist.");
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
