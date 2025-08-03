const mongoose = require("mongoose");

const Notes = mongoose.model("Notes", new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    task: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', 
        required: true 
    },
    content: {
        type: String,
        required: true 
    }
}, {
    timestamps: true
}))

module.exports = Notes;