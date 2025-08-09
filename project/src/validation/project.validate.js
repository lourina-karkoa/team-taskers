const { body, param } = require("express-validator");
const validate = require("../middlewares/validate.middleware");
const Project = require("../models/Project");


// vaildation add project
const validateAddProject = [

  body("name").notEmpty().withMessage("Name is required"),
  body("description")
    .isString()
    .withMessage("description must be a string (text)").bail(),
  body("startDate")
    .isISO8601()
    .withMessage(
      "Start date must be a valid ISO 8601 date (e.g., 2025-08-08)."
    ),
  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date (e.g., 2025-08-10).")
  
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("Due date must be **after** the start date.");
      }
      return true;
    }),
  validate,
];
const validateProjectId = [
  param('id')
    .notEmpty().withMessage('Project ID is required')
    .isMongoId().withMessage('Invalid project ID')
    .custom(async (projectId) => {
      const project = await Project.findById(projectId);
      if (!project) {
        return Promise.reject('Project not found');
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    next();
  }
];


// validation update project
const validateUpdateProject = [


  param("id")

    .custom(async (value) => {
      const project = await Project.findById(value);
      if (!project) {
        throw new Error("project not found. Please check the project ID and try again.");
      }
      return true;
    }).bail(),
  body("name").isString().optional(),

  body("description")
    .isString()
    .withMessage("description must be a string (text)")
    .optional(),

  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date (e.g., 2025-08-08).")
    .optional()
    .custom(async (value, { req }) => {
      if (!req.body.endDate) {
        const exist = await Project.findById(req.params.id);

        if (new Date(value) >= exist.endDate) {
          throw new Error(
            `start date must be **before** the date ${new Date(
              exist.endDate
            ).toISOString()}.`
          );
        }

      }
      return true;
    })
  ,

  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date (e.g., 2025-08-10).")
    .optional()
    .bail()
    .custom(async (value, { req }) => {
      if (!req.body.startDate) {
        const exist = await Project.findById(req.params.id);

        if (new Date(value) < exist.startDate) {
          throw new Error(
            `end date must be **after** the date ${new Date(
              exist.startDate
            ).toISOString()}.`
          );
        }
        return true;
      }
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("Due date must be **after** the start date.");
      }
      return true;
    }),
  validate,
];

module.exports = {
  validateAddProject,
  validateUpdateProject,
};

