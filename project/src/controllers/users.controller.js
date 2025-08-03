
const users = require("../models/Users")
const Task = require("../models/Task")
const Notes = require("../models/Notes")
const Projects = require("../models/Project")
const ActivityLogs = require("../models/ActivityLogs")
const { hash } = require("../helpers/argon2.helper");
const OTP = require("../models/OTP");
const sendEmail = require("../config/email");
const generateOTP = require("../helpers/generateOTP")



class UsersControllor {
    async getAll(req, res) {
        try {
            const TeamMember = await users.paginate({ filter: { role: "TeamMember" } })

            return res.status(200).json({ state: "success", message: "AllMembers", TeamMember: TeamMember })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProfile(req, res) {
        try {
            let { name, email } = req.body;

            const id = req.user.id;

            const userExist = await users.findById(id);
            if (!userExist) {
                return res.status(404).json({ state: "failed", message: "User not found", data: null });
            }

            let image = userExist.image;

            if (req.file) {
                image = req.file.filename;
            }

            name = name || userExist.name;
            email = email || userExist.email;
            image = image || userExist.image

            const data = await users.findByIdAndUpdate(id, { name, email, image }, { new: true }).select("-password")

            return res.status(200).json({ state: "success", message: "we update your profile data", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async sendOTP(req, res) {
        try {
            const { email } = req.body;

            const user = await users.findOne({ email })

            await OTP.deleteMany({ user: user._id });

            const key = generateOTP();

            await OTP.create({ user: user._id, otp_key: key, secretKey: generateOTP() });

            await sendEmail(email, key)

            return res.status(200).json({ state: "success", message: "we send otp", data: key })
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async checkOTP(req, res) {
        try {
            const { otp, email } = req.body;

            const user = await users.findOne({ email });

            const otpUser = await OTP.findOne({ user: user._id });

            if (!otpUser) {
                return res.status(400).json({ state: "failed", message: "Does not have an OTP, You must recieve one", data: null });
            }

            if (otpUser.otp_key !== otp) {
                return res.status(400).json({ state: "failed", message: "Invalid OTP", data: null });
            }

            return res.status(200).json({ state: "success", message: "Done", secret: otpUser.secretKey });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updatePassword(req, res) {
        try {
            const { password, email, secret } = req.body;

            if (!secret) {
                return res.status(401).json({ state: "failed", message: "Invalid secret", data: null });
            }

            const user = await users.findOne({ email });

            const verify = await OTP.findOne({ user: user._id, secretKey: secret });

            if (!verify) {
                return res.status(401).json({ state: "failed", message: "failed verify", data: null });
            }

            const hashed = await hash(password);

            await users.findOneAndUpdate({ email }, { password: hashed });


            await OTP.findByIdAndDelete(verify._id);

            return res.status(200).json({ state: "success", message: "Password updated successfully", data: { "email": `${email}` } });
        } catch (error) {
            throw new Error(error.message);
        }
    }


    deleteUser = async (req, res) => {
        try {
            const id = req.params.id

            const userExist = await users.findById(id);

            if (!userExist) {
                return res.status(400).json({
                    state: "failed",
                    message: "this user is not valied",
                    data: null,
                });
            }

            await Task.deleteMany({ assignedTo: id });
            await Notes.deleteMany({ user: id });
            await Projects.updateMany(
                { teamMembers: id },
                { $pull: { teamMembers: id } }
            );
            await ActivityLogs.deleteMany({ user: id });
            await users.findByIdAndDelete(id);
            return res.status(200).json({
                state: "success",
                message: "delete user is successfully",
                data: {},
            });
        } catch (error) {
            return res
                .status(500)
                .json({ state: "failed", message: error.message, data: null });
        }
    };
    deleteAllUser = async (req, res) => {
        try {

            await Projects.updateMany(
                {},
                { $set: { teamMembers: [] } }
            );
            await Task.deleteMany({});
            await Notes.deleteMany({ role: { $ne: 'Manager' } });
            await ActivityLogs.deleteMany({ role: { $ne: 'Manager' } });
            await users.deleteMany({ role: { $ne: 'Manager' } });
            return res.status(200).json({
                state: "success",
                message: "delete All Users(TeamMember) is Done",
                data: {},
            });
        } catch (error) {
            return res
                .status(500)
                .json({ state: "failed", message: error.message, data: null });
        }
    };
}
module.exports = new UsersControllor();

