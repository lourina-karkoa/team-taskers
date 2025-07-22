const mongoose = require('mongoose');
const paginate = require('../plugins/paginate');
/* 
create ActivityLog model

*/

const activityLogSchema = new mongoose.Schema({
    ActivityType:{
        type:String,
        required:[true,"ActivityType is required"],
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
        required:[true,"user is required"]
    },
    entityRef:{
            entityType:{
                type:String,
                enum:['Projects','Task','Notes','Users',null],
                default:null
        },
            entityId:{
                type:mongoose.Schema.Types.ObjectId,
                default:null,
                ref:'entityRef.entityType',
                
       },
    },
    description:{
        type:String,
        required:true
    }

},{timestamps:true});

activityLogSchema.plugin(paginate);

const ActivityLogs = mongoose.model('ActivityLog',activityLogSchema);

module.exports = ActivityLogs