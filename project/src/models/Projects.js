const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true 
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    }
},
{ timestamps: true });

const Projects = mongoose.model('Projects', projectSchema);

module.exports = Projects;