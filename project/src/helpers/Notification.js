const Notification = require("../models/Notification");
// Send a real-time notification if the user is online, otherwise save it to the database
async function sendNotification(io, userSockets, { userId, type, message, relatedId }) {
  const socketId = userSockets.get(userId.toString());

  if (socketId) {
    // User is online → send the notification through socket.io
    io.to(socketId).emit("notification", { type, message, relatedId });
  } else {
 // User is offline → save the notification in the database
    await Notification.create({
      userId,
      type,
      message,
      relatedId,
    });
  }
}

module.exports = sendNotification;
