const SendEmailUtility = require("../helper/emailHelper");
const otpModel = require("../models/otpModel");
const userModel = require("../models/userModel");
const bcrypy = require("bcrypt")

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

exports.verifyOtp = async (req, res) => {
    let email = req.body.email;
    let status = 0;
    let otpCode = req.body.otp;
    let statusUpdate = 1;
    try {
        let result = await otpModel.findOne({ email: email, otp: otpCode, status: status });
        if (result) {
            await otpModel.findOneAndUpdate({ email: email, otp: otpCode, status: status }, { status: statusUpdate });
            return res.status(200).json({
                status: "success",
                msg: "Otp verification successfully",
            })
        } else {
            return res.status(404).json({
                status: "fail",
                msg: "Otp not found"
            })
        }
    } catch (e) {
        res.status(500).json({
            status: "fail",
            msg: "Something went wrong"
        })
    }
};

exports.resetPassword = async (req, res) => {
    const { password, email, otp } = req.body;

    const statusUpdate = 0;
    const otpCode = 0;
    const saltRounds = 10;

    try {
        const hashedPassword = bcrypy.hashSync(password, saltRounds);

        const update = { password: hashedPassword };

        let otpData = await otpModel.findOne({ email: email, otp: otp });

        if (otpData) {

            await userModel.updateOne({ email:email}, update);

            await otpModel.updateOne({ email:email }, { $set: { otp: otpCode, status: statusUpdate } });

            return res.status(200).json({
                status: "success",
                msg: "Password reset successfully",
            });
        } else {
            return res.status(404).json({
                status: "fail",
                msg: "Otp not found"
            })
        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "fail",
            msg: "Error resetting password"
        });
    }
};