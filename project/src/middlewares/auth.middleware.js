const User = require('../models/Users');
const jwt = require('jsonwebtoken');


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
