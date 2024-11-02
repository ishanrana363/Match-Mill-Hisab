const vegetableModel = require("../models/vegetableModel");

exports.vegetableCreate = async (req, res) => {
    try {
        let reqbody = req.body;
        let vegetable = await vegetableModel.create(reqbody);
        res.status(201).json({
            status: "success",
            msg: "Vegetable created successfully",
            data: vegetable
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
            error: error.message
        });
    }
};