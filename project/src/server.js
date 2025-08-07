require("dotenv").config();
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Notification = require("./models/Notification");
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const connectedUsers = new Map(); // userId => socket.id

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  socket.on("register", async (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`Registered user ${userId} with socket ${socket.id}`);

    try {
    
      const unread = await Notification.find({ userId, read: false });
      unread.forEach((n) => {
        io.to(socket.id).emit("notification", {
          type: n.type,
          message: n.message,
          relatedId: n.relatedId,
        });
      });
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  });


  socket.on("markAsRead", async (notificationId) => {
    try {
      await Notification.findByIdAndUpdate(notificationId, { read: true });
      console.log(`Notification ${notificationId} marked as read`);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  });


  socket.on("disconnect", () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

app.set("io", io);
app.set("userSockets", connectedUsers);

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("Connected to the database successfully");
    server.listen(PORT, () => {
      console.log(`Running successfully on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
