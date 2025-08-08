const Notification = require("../models/Notification");

async function sendNotification(io, userSockets, { userId, type, message, relatedId }) {
  const socketId = userSockets.get(userId.toString());

  if (socketId) {

    io.to(socketId).emit("notification", { type, message, relatedId });
  } else {

    await Notification.create({
      userId,
      type,
      message,
      relatedId,
    });
  }
}

module.exports = sendNotification;
