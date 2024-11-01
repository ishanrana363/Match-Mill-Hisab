const userModel = require("../models/userModel");

exports.registration = async (req, res) => {
    try {
        let email = req.body.email;
        let reqbody = req.body;
        let userEmail = await userModel.findOne({ email: email });

        if (userEmail) return res.status(409).send({
            status: "fail",
            msg: "Email already exists",
        })
        
        let user = await userModel.create(reqbody);
        res.status(201).json({ message: "User registered successfully", data: user });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to register user",
            error: error.message
        })
    }
}