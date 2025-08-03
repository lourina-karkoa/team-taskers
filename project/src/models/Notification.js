const { default: mongoose } = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    type: { 
        type: String, 
        required: true },
    message: {
        type: String,
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId 
    },
    createdAt: { type: Date, default: Date.now }

}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification;