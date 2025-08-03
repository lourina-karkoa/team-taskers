const ActivityLogs = require('../models/ActivityLogs');

class ActivitiesLog {
    // API does fetch for full activity log and search by ActivityTpye (Manager only)
    getAllActivityLogs = async (req, res) => {
        try {
            const page = parseInt(req.query.page) ||1;
            const Activity = req.query.Activity;
            const logges = 
               Activity
               ? await ActivityLogs.paginate({filter:{ActivityType:Activity},populate:'user' ,select: ['user', 'ActivityType', 'description', 'entityRef.entityId','createdAt'], page: page })
               : await ActivityLogs.paginate({populate:'user' ,select: ['user', 'ActivityType', 'description', 'entityRef.entityId','createdAt'], page: page });

            return res.status(200).json({ message: "Activity logs have been successfully brought in", Data: logges })
        } catch (error) {
            throw new Error(error.message);
        }

    };
    // API view the activities of a user id (manager only)
    getUserActivity = async (req, res) => {
        try {
            const id = req.params.userId;
            const page = parseInt(req.query.page) ||1;
            const logges = await ActivityLogs.paginate({ filter: { user: id },populate:'user', select: ['user','ActivityType', 'description', 'entityRef.entityId','createdAt'], page: page })
            return res.status(200).json({ message: "fetched user activities successfully", Data: logges })
        } catch (error) {
            throw new Error(error.message);
        }

    };
    // API view the activities of a entity id (manager only)
    getentityActivity = async (req, res) => {
        try {
            const id = req.params.entityId;
            const page = parseInt(req.query.page) ||1;
            const logges = await ActivityLogs.paginate({ filter: {'entityRef.entityId' : id },populate:'user', select: ['user','ActivityType', 'description', 'entityRef','createdAt'], page: page })
            return res.status(200).json({ message: "fetched user activities successfully", Data: logges })
        } catch (error) {
            throw new Error(error.message);
        }

    };

    // API view the Myactivities 
    getMyActivity = async (req, res) => {
        try {
            const id = req.user.id;
            const page = parseInt(req.query.page) ||1;
            const logges = await ActivityLogs.paginate({ filter: { user: id },populate:'user', select: ['user','ActivityType', 'description', 'entityRef.entityId','createdAt'], page: page })
            return res.status(200).json({ message: "fetched  Myactivities successfully", Data: logges })
        } catch (error) {
            throw new Error(error.message);
        }

    };

    // API fetch specific activity details by id Activity
    getActivityById = async (req, res) => {
        try {
            const id = req.params.id
            const logges = await ActivityLogs.findById(id).populate({ path: 'user', select: ['name','email','image','role'] })
            if(!logges){
                return res.status(404).json({ message: "activity not found!" })
            }
            return res.status(200).json({ message: "fetched MyActivit logs successfully", Data: logges })
        } catch (error) {
            throw new Error(error.message);
        }

    };
    
    // API deletes full activity history(manager only)
    deleteAllActivityLogs = async (req, res) => {
        try {

            const logges = await ActivityLogs.deleteMany();
            if(logges.deletedCount === 0){
             return res.status(404).json({ message: "Activity-logs is empty" })
            }

            return res.status(200).json({ message: "Deleted successfully" })
        } catch (error) {
            throw new Error(error.message);
        }

    };
        // API delete activity by id(manager only)
    deleteActivityLog = async (req, res) => {
        try {
            const logId = req.params.logId;
            const logges = await ActivityLogs.findByIdAndDelete(logId);
            if(!logges){
             return res.status(404).json({ message: "activity not found!" })
            }

            return res.status(200).json({ message: "Deleted successfully" })
        } catch (error) {
            throw new Error(error.message);
        }

    };

}
module.exports = new ActivitiesLog();
