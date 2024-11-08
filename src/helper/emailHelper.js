const nodemailer = require('nodemailer');
require("dotenv").config()
let pass = process.env.SMTP_PASS
let smtpTransport = require("nodemailer-smtp-transport");
const SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
    let transporter = nodemailer.createTransport(
        smtpTransport({
            service: "Gmail",
            auth: {
                user: "ishanrana094@gmail.com",
                pass: pass
            },
        }
        )
    );
    let mailOptions = {
        from: 'ishanrana094@gmail.com',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };

    return await transporter.sendMail(mailOptions)

}
module.exports = SendEmailUtility