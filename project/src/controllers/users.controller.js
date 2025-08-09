const users = require("../models/Users")
const { hash } = require("../helpers/argon2.helper");
const OTP = require("../models/OTP");
const sendEmail = require("../config/email");
const generateOTP = require("../helpers/generateOTP")



class UsersControllor {
        // getAll User
    async getAll(req, res) {
        try {
            const TeamMember = await users.paginate({ filter: { role: "TeamMember" } })

            return res.status(200).json({ state: "success", message: "AllMembers", data: TeamMember })
        } catch (error) {
            throw new Error(error.message);
        }
    }
    // edit info User
async updateProfile(req, res) {
        try {
            let { name } = req.body;

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
            image = image || userExist.image

            const data = await users.findByIdAndUpdate(id, { name, image }, { new: true }).select("-password")

            return res.status(200).json({ state: "success", message: "we update your profile data", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // sendOTP 
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

    // checkOTP 
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

            return res.status(200).json({ state: "success", message: "OTP verified successfully.", secret: otpUser.secretKey });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // updatePassword
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

}
module.exports = new UsersControllor();

