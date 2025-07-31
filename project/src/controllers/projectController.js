const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/Users');
const ActivityLogs = require('../models/ActivityLogs');
const logActivity = require('../helpers/logActivity.helper');
// Create new project (Manager only)
const createProject = async (req, res) => {
    try {
        const { title , description, startDate, endDate, teamMembers } = req.body;

// Verify team members exist
    if (teamMembers && teamMembers.length > 0) {
        const validMembers = await User.find({
            _id: { $in: teamMembers }
        });
        
        if (validMembers.length !== teamMembers.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more team members not found or inactive'
            });
        }
    }

    const project = new Project({
        title,
        description,
        startDate,
        endDate,
        manager: req.user._id,
        teamMembers: teamMembers || []
    });

    await project.save();
    await project.populate('manager teamMembers', 'name email role');

    // Log activity
    await logActivity('CREATE_PROJECT',req.user._id,'Project',project._id);

    res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: { project }
    });
}
    catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

    let filter = { isActive: true };
    
    // If user is team member, only show projects they're assigned to
    if (req.User.role === 'TeamMember') {
        filter.$or = [
            { teamMembers: req.user._id },
            { manager: req.user._id }
        ];
    }

    if (status) {
        filter.status = status;
    }

    const projects = await Project.find(filter)
    .populate('manager teamMembers', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Project.countDocuments(filter);

    res.json({
        success: true,
        data: {
            projects,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        }
    });
}
    catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get single project by ID
const getProject = async (req, res) => {
    try {
        const { id } = req.params;

    let filter = { _id: id, isActive: true };
    
    // If user is team member, check access
    if (req.User.role === 'TeamMember') {
        filter.$or = [
            { teamMembers: req.user._id },
            { manager: req.user._id }
        ];
    }

    const project = await Project.findOne(filter)
    .populate('manager teamMembers', 'name email role')
    .populate({
        path: 'tasks',
        populate: {
            path: 'assignedTo createdBy',
            select: 'name email'
        }
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found or access denied'
        });
    }

    res.json({
        success: true,
        data: { project }
    });
}
    catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update project (Manager only)
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, startDate, endDate, status, teamMembers } = req.body;
        
        const project = await Project.findOne({ _id: id, isActive: true });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

    // Verify team members exist if provided
        if (teamMembers && teamMembers.length > 0) {
            const validMembers = await User.find({
                _id: { $in: teamMembers },
                isActive: true
            });

        if (validMembers.length !== teamMembers.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more team members not found or inactive'
            });
        }
    }

    // Update project
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { title, description, startDate, endDate, status, teamMembers },
            { new: true, runValidators: true }
        ).populate('manager teamMembers', 'name email role');


    // Log activity
     await logActivity('PROJECT_UPDATE',req.user._id,'Project',project._id);


        res.json({
            success: true,
            message: 'Project updated successfully',
            data: { project: updatedProject }
        });
    }
        catch (error) {
            console.error('Update project error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    };

// Delete project (Manager only)
        const deleteProject = async (req, res) => {
            try {
                const { id } = req.params;
                
                const project = await Project.findOne({ _id: id, isActive: true });
                if (!project) {
                    return res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                }

    // Check if project has active tasks
    const activeTasks = await Task.countDocuments({ 
        project: id, 
        status: { $nin: ["completed", "delayed"] } 
    });

    if (activeTasks > 0) {
        return res.status(400).json({
            success: false,
            message: 'Cannot delete project with active tasks. Complete or cancel all tasks first.'
        });
    }

    // Soft delete
    await project.save();

    // Log activity
    await logActivity('PROJECT_DELETED',req.user._id,'Project',project._id);

    res.json({
        success: true,
        message: 'Project deleted successfully'
    });
}
catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
};
