const Activity = require("../models/ActivityLogs");

const logActivity = async ({ userId, activityType, entityType = null, entityId = null, description }) => {
  try {
    await Activity.create({
      ActivityType: activityType,
      user: userId,
      entityType,
      entityId,
      description
    });
  } catch (err) {
    console.error(" Failed to log activity:", err.message);
  }
}

module.exports = logActivity;
