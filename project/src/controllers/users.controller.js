const users = require("../models/Users");

/*

// API does fetch for full activity log
const ActivityLogs = require('../models/ActivityLogs');

 getAllActivityLogs = async (req, res) => {
    try {
        const page = req.query.page;
        const logges = await ActivityLogs.paginate({select:['user','ActivityType','description','entityRef.entityId'],page:page})

        return res.status(201).json({ message: "Done",Data: logges })
    } catch (error) {
        throw new Error(error.message);
    }

};

// API deletes full activity history
 deleteAllActivityLogs = async (req, res) => {
    try {
        
        const logges = await ActivityLogs.deleteMany();

        return res.status(201).json({ message: "Deleted successfully" })
    } catch (error) {
        throw new Error(error.message);
    }

};
// API fetch the activities he has added
 getMyActivity = async (req, res) => {
    try {
        const id = req.id;
        const page = req.query.page;
        const logges = await ActivityLogs.paginate({filter:{user:id},select:['user','ActivityType','description','entityRef.entityId'],page:page})
        return res.status(201).json({ message: "fetched MyActivit logs successfully",Data:logges })
    } catch (error) {
        throw new Error(error.message);
    }

};
 

// API fetch specific activity details
 getActivityById = async (req, res) => {
    try {
        const id = req.parmas.id
        const logges = await ActivityLogs.findById(id).populate(path:'user',select:'name')
        return res.status(201).json({ message: "fetched MyActivit logs successfully",Data:logges })
    } catch (error) {
        throw new Error(error.message);
    }

};
*/