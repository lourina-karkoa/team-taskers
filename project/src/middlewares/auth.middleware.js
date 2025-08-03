const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const ActivityLog = require('../models/ActivityLogs');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access token is required' 
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token or user not active' 
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
};

// Check if user is manager
const requireManager = (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ 
            success: false, 
            message: 'Manager access required' 
        });
    }
    next();
};


// Log activity middleware
const logActivity = (action, targetModel = null) => {
    return async (req, res, next) => {
        try {
            const activityData = {
                action,
                user: req.users._id,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            };
            
            if (targetModel) {
                activityData.targetModel = targetModel;
                activityData.targetId = req.params.id || req.body._id;
            }
            
            await ActivityLog.create(activityData);
            next();
        }
        catch (error) {
            console.error('Activity logging error:', error);
            next(); // Continue even if logging fails
            }
        };
    };
module.exports = {
    authenticateToken,
    requireManager,
    logActivity
};


const auth = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(401).json({ message: "Authorization must be required" })
    }

    try {
        const token = authorization.split(" ")[1];

        const { id, email, role } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const isExist = await User.findById(id);

        if(!isExist) {
            return res.status(401).json({ message: "Invalid Authorization" })
        }

        req.user = { id, email, role };

        console.log(req.user)

        next();
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = auth

