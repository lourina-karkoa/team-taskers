const express = require("express");
const ActivityRouter = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const ActivitiesLog = require('../controllers/activityLogs.controller');
const validateObjectId = require('../middlewares/validateObjectId.middleware');

//routes

//get All Activity -logs
ActivityRouter.get('/',[auth,role(["Manager"])],ActivitiesLog.getAllActivityLogs);
//get Activity -logs by user
ActivityRouter.get('/user/:userId',[auth,role(["Manager"]),validateObjectId("userId")],ActivitiesLog.getUserActivity);
//get Activity -logs by entityId
ActivityRouter.get('/entityActivity/:entityId',[auth,role(["Manager"]),validateObjectId("entityId")],ActivitiesLog.getentityActivity);
//get MyActivity -logs 
ActivityRouter.get('/My',[auth,role(["Manager","TeamMember"])],ActivitiesLog.getMyActivity);
ActivityRouter.get('/:id',[auth,role(["Manager","TeamMember"]),validateObjectId("id")],ActivitiesLog.getActivityById);
ActivityRouter.delete('/deleteActivity/:logId',[auth,role(["Manager"]),validateObjectId("logId")],ActivitiesLog.deleteActivityLog);
ActivityRouter.delete('/deleteAllActivity',[auth,role(["Manager"])],ActivitiesLog.deleteAllActivityLogs);


module.exports = ActivityRouter