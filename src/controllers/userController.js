const { tokenCreate } = require("../helper/tokenHelper");
const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
require("dotenv").config();

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
        res.status(201).send({
            status: "success",
            msg: "User registered successfully",
            user: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to register user",
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        let reqBody = req.body;

        const { email, password } = reqBody;

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).send({
                status: "fail",
                message: "User not found"
            });
        }
        let matchPassword = bcrypt.compareSync(password, user.password);
        if (!matchPassword) {
            return res.status(403).json({
                status: "fail",
                msg: "password not match",
            });
        }
        const key = process.env.SECRET_KEY;
        const token = tokenCreate({user}, key, "10d" );
        return res.status(200).json({
            status: "success",
            token: token,
        });
    } catch (error) {
        return res.status(500).send({
            status: "fail",
            message: error.toString()
        })
    }
};