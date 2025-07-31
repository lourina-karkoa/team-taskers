const { body, param, query } = require('express-validator');
const Users = require("../models/Users");
const validate = require("../middlewares/validate.middleware");
const mongoose = require("mongoose");
const updateProfileValidate = [
  body("name")
    .isString().withMessage("Name must be string"),

  body("email")
    .isString().withMessage("Email must be string")
    .isEmail().withMessage("Invalid Email")
    .custom(async (value, { req }) => {
      const existingUser = await Users.findOne({ email: value });

      if (existingUser && existingUser._id !== req.user._id) {
        throw new Error("Email is already used by another user");
      }

      return true;
    }),


  validate
]

const deleteUserValidate = [
  param("id")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid user ID");
      }
      return true;
    })
    .bail()
    .custom(async (value) => {
      const user = await Users.findById(value);
      if (!user) {
        throw new Error("User not found");
      }
      return true;
    }),

  validate,
];
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
  deleteUserValidate,
  otpValidate,
  checkOTPValidate,
  updatePasswordValidate
}