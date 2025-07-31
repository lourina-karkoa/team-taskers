const express = require("express");
const router = express.Router();
const upload = require("../config/multer");


const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// controller
const usersController = require("../controllers/users.controller");
const { updateProfileValidate, deleteUserValidate, updatePasswordValidate, checkOTPValidate ,otpValidate} = require("../validation/users.validate");
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

// Delete
router.delete("/:id", [auth, role(["Manager"])], [...deleteUserValidate], usersController.deleteUser);

router.delete("/", [auth, role(["Manager"])], usersController.deleteAllUser);


module.exports = router