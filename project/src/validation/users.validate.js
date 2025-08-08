const { body } = require('express-validator');
const Users = require("../models/Users");
const validate = require("../middlewares/validate.middleware");

// Validate profile update - only 'name' can be updated and must be a string
const updateProfileValidate = [
  // Validate that name is a string
   body("name")
    .optional()
    .isString().withMessage("Name must be string"),
  validate
]

// Validate email before sending OTP
const otpValidate = [
  
  body("email")
    .isString().withMessage("Email must be string")
    .isEmail().withMessage("Invalid Email")
    .custom(async (value) => {
      const user = await Users.findOne({ email: value });

      if (!user) {
        throw new Error("Email not found");
      }

      return true;
    }),

  validate,
];

// Validate OTP check request
const checkOTPValidate = [
  body("email")
    .isString().withMessage("Email must be string")
    .isEmail().withMessage("Invalid email format")
    .custom(async (value) => {

      const user = await Users.findOne({ email: value });

      if (!user) throw new Error("Email not found");

      return true;
    })
    .bail(),

  body("otp")
    .isString().withMessage("OTP must be string")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
  ,

  validate,
];

// Validate password update request
const updatePasswordValidate = [
  body("email")
    .isString().withMessage("Email must be string")
    .isEmail().withMessage("Invalid email format")
    .custom(async (value) => {

      const user = await Users.findOne({ email: value });

      if (!user) throw new Error("Email not found");

      return true;
    })
    .bail(),

  body("password")
    .isString().withMessage("Password must be string")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 charecter")
    .isStrongPassword().withMessage("Invalid Password")
    .bail(),

  validate
]

module.exports = {
  updateProfileValidate,
  otpValidate,
  checkOTPValidate,
  updatePasswordValidate
}