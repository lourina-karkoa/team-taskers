const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'on_hold'],
        default: 'planning'
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Project manager is required']
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});


module.exports = mongoose.model('Project', projectSchema);