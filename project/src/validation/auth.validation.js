const { body } = require("express-validator");
const Users = require("../models/Users");
const validate = require("../middlewares/validate.middleware");


const signupValidate = [
    body("name")
        .isString().withMessage("Name must be string"),

    body("email")
        .isString().withMessage("Email must be string")
        .isEmail().withMessage("Invalid Email")
        .custom(async (value) => {
            const isEmail = await Users.findOne({ email: value });

            if(isEmail) {
                throw new Error("Your email is already exist")
            }

            return true;
        }),
    
    body("password")
        .isString().withMessage("Password must be string")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 charecter")
        .isStrongPassword().withMessage("Invalid Password"),

    validate
]

const loginValidate = [
    body("email")
        .isString().withMessage("Email must be string")
        .isEmail().withMessage("Invalid Email"),
    
    body("password")
        .isString().withMessage("Password must be string")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 charecter"),

    validate
]


module.exports = {
    signupValidate,
    loginValidate,
}