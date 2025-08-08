const { default: mongoose } = require("mongoose");
// schema notification
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
    ,read: { type: Boolean, default: false }

}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification;