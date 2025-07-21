const mongoose = require('mongoose');
/* 
create ActivityLog model
Note:entityType must be the same name as the models of both project , task , note 
*/

const activityLogSchema = new mongoose.Schema({
    ActivityType:{
        type:String,
        required:true,
        enum:[
            'CREATE_PROJECT',
            'CREATE_TASK','UPDATE_TASK',
            'ADD_NOTE',
            'USER_LOGIN'
        ]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    entityType:{
        type:String,
        enum:['Project','Task','Note',null],
        default:null
    },
    entityId:{
        type:mongoose.Schema.Types.ObjectId,
        // ref:entityType,
        default:null
    },
    description:{
        type:String,
        required:true
    }

},{timestamps:true});

const ActivityLogs = mongoose.model('ActivityLog',activityLogSchema);

module.exports = ActivityLogs