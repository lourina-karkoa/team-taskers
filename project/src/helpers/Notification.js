const Notification = require("../models/Notification");

async function sendNotification(io, userSockets, { userId, type, message, relatedId }) {
  const socketId = userSockets.get(userId);

  if (socketId) {

    io.to(socketId).emit("notification", { type, message, relatedId });
  } else {

    await Notification.create({
      userId,
      type,
      message,
      relatedId,
      read: false,
    });
  }
}

module.exports = sendNotification;
