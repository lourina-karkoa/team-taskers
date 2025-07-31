const ActivityLogs = require('../models/ActivityLogs');

class ActivitiesLog {
    // API does fetch for full activity log and search by ActivityTpye (Manager only)
    getAllActivityLogs = async (req, res) => {
        try {
            const page = parseInt(req.query.page);
            const Activity = req.query.Activity;

            const logges = 
               Activity
               ? await ActivityLogs.paginate({filter: {ActivityType:'Activity'},populate:'user' ,select: ['user', 'ActivityType', 'description', 'entityRef.entityId'], page: page })
               : await ActivityLogs.paginate({populate:'user' ,select: ['user', 'ActivityType', 'description', 'entityRef.entityId'], page: page });

            return res.status(201).json({ message: "Activity logs have been successfully brought in", Data: logges })
        } catch (error) {
            throw new Error(error.message);
        }

    };

    // API deletes full activity history(manager only)
    deleteAllActivityLogs = async (req, res) => {
        try {

            const logges = await ActivityLogs.deleteMany();

            return res.status(201).json({ message: "Deleted successfully" })
        } catch (error) {
            throw new Error(error.message);
        }

    };
        // API delete activity by id(manager only)
    deleteActivityLog = async (req, res) => {
        try {
            const logId = req.parmas.logId;
            const logges = await ActivityLogs.findByIdAndDelete(logId);
            if(!logges){
             return res.status(404).json({ message: "activity not found!" })
            }

            return res.status(201).json({ message: "Deleted successfully" })
        } catch (error) {
            throw new Error(error.message);
        }

    };
    // API view the activities of a spercific user
    getUserActivity = async (req, res) => {
        try {
            const id = req.query.id;
            const page = parseInt(req.query.page);
            const logges = await ActivityLogs.paginate({ filter: { user: id }, select: ['ActivityType', 'description', 'entityRef.entityId'], page: page })
            return res.status(201).json({ message: "fetched user activities successfully", Data: logges })
        } catch (error) {
            throw new Error(error.message);
        }

    };


    // API fetch specific activity details
    getActivityById = async (req, res) => {
        try {
            const id = req.parmas.id
            const logges = await ActivityLogs.findById(id).populate({ path: 'user', select: 'name' })
            return res.status(201).json({ message: "fetched MyActivit logs successfully", Data: logges })
        } catch (error) {
            throw new Error(error.message);
        }

    };

}
module.exports = new ActivitiesLog();
