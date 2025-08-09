const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");

// validation add note
const validateNote = [
    body('content')
    .isString().withMessage("content must be text")
    .trim()
    .notEmpty().withMessage("Note must not be empty"),

    body('important')
    .isBoolean().withMessage("importNote must be TRUE or FALSE")
    .optional(),
     validate
];

// validation update note
const validateUpdateNote = [
    body('content')
    .isString().withMessage("content must be text")
    .trim()
    .notEmpty().withMessage("Note must not be empty"),
     validate
];
module.exports =  {
    validateNote,
    validateUpdateNote
}

