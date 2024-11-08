const SendEmailUtility = require("../helper/emailHelper");
const otpModel = require("../models/otpModel");
const userModel = require("../models/userModel");

exports.sendMail = async (req, res) => {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const emailSubject = "MIll Hisab  OTP Code";
    const emailText = `Your OTP code is ${otpCode}`;
    const filter = { email };

    try {
        const user = await userModel.find({email : email });

        if (user) {
            // Send OTP email
            await SendEmailUtility(email, emailText, emailSubject);

            // Update or insert OTP in the database
            await otpModel.findOneAndUpdate(
                { email : email},
                { $set: { otp: otpCode } },
                { upsert: true }
            );

            return res.status(200).json({
                status: "success",
                msg: "6-digit OTP has been sent successfully"
            });
        } else {
            return res.status(404).json({
                status: "fail",
                msg: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Something went wrong"
        });
    }
}