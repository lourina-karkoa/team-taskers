const express = require("express");
const ActivityRouter = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const ActivitiesLog = require('../controllers/activityLogs.controller');

//routes
ActivityRouter.get('/test',[auth,role(["Manager"])],ActivitiesLog.getAllActivityLogs);


module.exports = ActivityRouter