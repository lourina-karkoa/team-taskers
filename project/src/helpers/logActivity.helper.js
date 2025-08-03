const ActivityLogs = require('../models/ActivityLogs');
/*

*/
const logActivity = async ( Activity, userId, entityType, entityId ) => {
    try {
        let description = "";
        switch (Activity) {
            case 'CREATE_PROJECT':
                description = "A new Project has been created"
                break;
            case 'CREATE_TASK':
                description = "A new Task has been created"
                break;
            case 'UPDATE_TASK':
                description = "The Task has been modified"
                break;
            case 'ADD_NOTE':
                description = "A new Note has been created"
                break;
            case 'USER_LOGIN':
                description = "You are logged in"
                break;
            default:
                description = "Unknown activity !"

        }
        
        const log =  new ActivityLogs({
            ActivityType:Activity,
            user:userId,
            entityRef:{
                entityType,
                entityId
            },
            description
        });
        await log.save();

    } catch (error) {
        console.error('Error logging activity:', error);
    }

}

module.exports = logActivity;