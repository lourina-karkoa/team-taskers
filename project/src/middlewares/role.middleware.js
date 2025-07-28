const role = (roles) => {
    return async (req, res, next) => {
        try {
            for (const role of roles) {
                if(req.user.role === role) {
                    next();
                    return;
                }
            }
            
            return res.status(401).json({ message: "You can not access to this action" })
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = role