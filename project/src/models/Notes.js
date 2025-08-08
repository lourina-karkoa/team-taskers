const mongoose = require("mongoose");

const Notes = mongoose.model("Notes", new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
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
    },
    important : { type: Boolean, default: false }
}, {
    timestamps: true
}))

module.exports = Notes;