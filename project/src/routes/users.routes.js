const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); // handle file uploads
const auth = require("../middlewares/auth.middleware"); // verifyToken
const role = require("../middlewares/role.middleware"); // verify-role
const usersController = require("../controllers/users.controller"); // controller
// validation
const { updateProfileValidate, updatePasswordValidate, checkOTPValidate ,otpValidate} = require("../validation/users.validate");
// const checkImage = require("../middlewares/checkImage");

// routes

// GET 
router.get("/", [auth, role(["Manager"])], usersController.getAll);

// POST
router.post("/send-otp", [...otpValidate], usersController.sendOTP)

router.post("/check-otp",[...checkOTPValidate], usersController.checkOTP)

// PUT 
router.put("/update", [auth, upload.single("image") ,...updateProfileValidate], usersController.updateProfile);

router.put("/update-password", [...updatePasswordValidate], usersController.updatePassword);

module.exports = router