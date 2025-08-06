const jwt = require("jsonwebtoken");
const { hash, verify } = require("../helpers/argon2.helper");
const Users = require("../models/Users");
const logActivity = require('../helpers/logActivity.helper');

const createToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
}

class UsersControllor {

    /////sign up

    async signup(req, res) {
        try {
            const { name, email, password  } = req.body; 

            const hashed = await hash(password);

            const image = req.file?.filename;

            const user = await Users.create({ name, email, password: hashed ,image });

            const token = createToken({
                email,
                id: user._id,
                role: user.role
        });

            return res.status(201).json({
                message: "User created successfully",
                data: user ,
                token
                
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }


    /////log in1
    async login(req, res) {
        try {
            const { email, password } = req.body; 
            const user = await Users.findOne({ email });

            if(!user) {
                return res.status(400).json({ message: "Invalid Email" }) 
            }

            const verified = await verify(password, user.password);

            if(!verified) {
                return res.status(400).json({ message: "Invalid password" }) 
            }

            const token = createToken({ email, id: user._id, role: user.role })

            const data = await Users.findOne({ email }).select("-password")
             // Log activity
            await logActivity('USER_LOGIN',user.id,'Users',user.id);
            return res.status(201).json({ message: "Done", data, token })
        } catch (error) {
            throw new Error(error.message);
        }
    }


    ////////log out
    async logout(req, res) {
        try {
            // Log activity
            await logActivity('USER_LOGOUT',req.user.id,'Users',req.user.id)
            return res.status(200).json({ message: "Done" });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new UsersControllor();