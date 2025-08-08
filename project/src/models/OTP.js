const { default: mongoose, Schema } = require("mongoose");
// schema OTP
const OTP = mongoose.model("OTP", new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, //ref to Users model
    otp_key: { type: String, required: true },
    secretKey: { type: String, required: true }
}, {
    timestamps: true
}))

module.exports = OTP;