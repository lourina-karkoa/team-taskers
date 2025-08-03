const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");

const validateNote = [
    body('content')
    .isString().withMessage("content must be text")
    .trim()
    .notEmpty().withMessage("Note must not be empty"),
     validate
];

module.exports =  validateNote

