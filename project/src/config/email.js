const nodemailer = require("nodemailer");
const PASS = process.env.PASS;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "lourinalolo675@gmail.com",
        pass: `${PASS}`
    }
})

async function sendEmail(to, otp) {
    try {
        const opts = {
            from: "lourinalolo675@gmail.com",
            to,
            subject: "Password Reset OTP",
            text: `Please enter the OTP: ${otp}`
        };

        await transporter.sendMail(opts)
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = sendEmail