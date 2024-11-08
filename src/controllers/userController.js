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
};

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

        if(user.isDisable){
            return res.status(403).json({
                status: "fail",
                msg: "Your account is disabled. Please contact authority",
            });
        }

        let matchPassword = bcrypt.compare(password, user.password);


        if (!matchPassword) {
            return res.status(403).json({
                status: "fail",
                msg: "password not match",
            });
        }
        const key = process.env.SECRET_KEY;
        const token = tokenCreate({_id : user._id,email:user.email,role:user.role}, key, "10d" );

        await userModel.updateOne({email : email},{token: token},{new:true});
        
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

exports.updateUser = async (req, res) => {
    try {
        let reqbody = req.body;
        let userId = req.headers._id

        let filter = {_id : userId,isDisable : false}

        // Update the user with the provided data
        let user = await userModel.findByIdAndUpdate(filter,reqbody, { new: true });
        
        // Check if user was found
        if (!user) {
            return res.status(404).json({
                status: "fail",
                msg: "User not found"
            });
        }

        // If user is found and updated, send success response
        return res.status(200).json({
            status: "success",
            msg: "User updated successfully",
            data: user
        });

    } catch (error) {
        // Handle any errors that occur
        return res.status(500).json({
            status: "fail",
            message: error.toString()
        });
    }
};

exports.userProfile = async (req, res) => {
    try {
        let id = req.headers._id;
        let user = await userModel.findById(id);
        
        // Check if the user was found
        if (!user) {
            return res.status(404).send({
                status: "fail",
                msg: "User not found",
            });
        }

        // If the user is found, send success response
        return res.status(200).send({
            status: "success",
            msg: "User fetched successfully",
            data: user
        });

    } catch (error) {
        // Handle any errors that occur
        return res.status(500).json({
            status: "fail",
            message: "Failed to fetch user",
            error: error.toString()
        });
    }
};

exports.userList = async (req, res) => {
    try {

        let pageNo = Number(req.params.pageNo);

        let perPage = Number(req.params.perPage);

        let searchValue = req.params.searchValue ? String(req.params.searchValue) : "";

        let skipRow = (pageNo - 1) * perPage;

        let data;

        if (searchValue !== "0" && searchValue !== "") {
            let searchRegex = { "$regex": searchValue, "$options": "i" };
            let searchQuery = { $or: [{ username: searchRegex }, { phone: searchRegex }, { email: searchRegex }] };
            data = await userModel.aggregate([
                {
                    $match : {
                        isDisable : false,
                    }
                },
                {
                    $facet: {
                        Total: [{ $match: searchQuery }, { $count: "count" }],
                        Rows: [{ $match: searchQuery }, { $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        } else {
            data = await userModel.aggregate([
                {
                    $match : {
                        isDisable : false,
                    }
                },
                {
                    $facet: {
                        Total: [{ $count: "count" }],
                        Rows: [{ $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        }

        res.status(200).send({
            msg: "User fetched successfully",
            status: "success",
            data: data
        });
    } catch (error) {
        res.status(500).send({
            msg: "Failed to fetch border",
            status: "fail",
            error: error.toString()
        });
    }
};

exports.userStatusUpdate = async (req,res) => {
    try {

        let id = req.headers._id;
        let status = req.body.role;
        let userId = req.params.userId;
        
        let filter = {
            _id: id,
            _id : userId,
            isDisable : false
        };
        
        let user = await userModel.findByIdAndUpdate(filter, { role: status }, { new: true });
        
        if (!user) {
            return res.status(404).json({
                status: "fail",
                msg: "User not found"
            });
        }
        return res.status(200).json({
            status: "success",
            msg: "User status updated successfully",
            data: user
        });
    
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: "Failed to update user status",
            error: error.toString()
        })
    }
};

exports.userDelete = async (req, res) => {
    try {
        let id = req.params.id;
        let isDisable = false;
        
        let filter = {
            _id: id,
            isDisable: isDisable
        };
        let user = await userModel.findByIdAndUpdate(filter, { isDisable: true }, { new: true });
        if (!user) {
            return res.status(404).json({
                status: "fail",
                msg: "User not found"
            });
        }
        return res.status(200).json({
            status: "success",
            msg: "User deleted successfully",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: "Failed to delete user",
            error: error.toString()
        });
    }
};

exports.disableUserList = async (req, res) => {
    try {

        let pageNo = Number(req.params.pageNo);

        let perPage = Number(req.params.perPage);

        let searchValue = req.params.searchValue ? String(req.params.searchValue) : "";

        let skipRow = (pageNo - 1) * perPage;

        let data;

        if (searchValue !== "0" && searchValue !== "") {
            let searchRegex = { "$regex": searchValue, "$options": "i" };
            let searchQuery = { $or: [{ username: searchRegex }, { phone: searchRegex }, { email: searchRegex }] };
            data = await userModel.aggregate([
                {
                    $match : {
                        isDisable : true,
                    }
                },
                {
                    $facet: {
                        Total: [{ $match: searchQuery }, { $count: "count" }],
                        Rows: [{ $match: searchQuery }, { $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        } else {
            data = await userModel.aggregate([
                {
                    $match : {
                        isDisable : true,
                    }
                },
                {
                    $facet: {
                        Total: [{ $count: "count" }],
                        Rows: [{ $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        }

        res.status(200).send({
            msg: "User fetched successfully",
            status: "success",
            data: data
        });
    } catch (error) {
        res.status(500).send({
            msg: "Failed to fetch border",
            status: "fail",
            error: error.toString()
        });
    }
};

exports.enableUser = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await userModel.findByIdAndUpdate(
            { _id: id, isDisable: true },  
            { isDisable: false },          
            { new: true }                  
        );

        if (!user) {
            return res.status(404).json({
                status: "fail",
                msg: "User not found or user is not disabled"
            });
        }

        return res.status(200).json({
            status: "success",
            msg: "User enabled successfully",
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: "Failed to enable user",
            error: error.toString()
        });
    }
};
