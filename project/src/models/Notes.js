const { default: mongoose } = require("mongoose");

const Notes = mongoose.model("Notes", new mongoose.Schema({
    user: { 
        type: ObjectId, 
        ref: 'User', 
        required: true 
    },
    task: { 
        type: ObjectId, ref: 'Task', 
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