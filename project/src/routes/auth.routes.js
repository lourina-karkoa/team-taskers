const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { signupValidate, loginValidate } = require("./../validation/auth.validation");
const upload = require("../config/multer");





////signup
router.post("/signup", upload.single("image"), [...signupValidate] , authController.signup);

////login
router.post("/login", [...loginValidate], authController.login);

////logout
router.post("/logout", [auth], authController.logout)

module.exports = router;