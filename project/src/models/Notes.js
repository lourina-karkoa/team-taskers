const mongoose = require("mongoose");
const paginate = require('../plugins/paginate');
const NoteSchema =  new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true 
    },
    // importNote:{
    //     type:mongoose.Schema.Types.Boolean,
    //     required:true
    // },
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
})
NoteSchema.plugin(paginate);
const Notes = mongoose.model("Notes",NoteSchema)
module.exports = Notes;