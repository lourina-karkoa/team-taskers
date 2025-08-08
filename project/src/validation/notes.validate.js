const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");

const validateNote = [
    body('content')
    .isString().withMessage("content must be text")
    .trim()
    .notEmpty().withMessage("Note must not be empty"),

    body('importNote')
    .isBoolean().withMessage("importNote must be TRUE or FALSE")
    .notEmpty().withMessage("importNote must not be empty ,enter:{TRUE or FALSE}"),
     validate
];


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

