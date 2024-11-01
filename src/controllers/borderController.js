const borderModel = require("../models/borderModel");

exports.borderCreate = async (req,res)=>{
    try {
        let reqbody = req.body;
        let border = await borderModel.create(reqbody);
        res.status(201).json({
            status: "success",
            msg: "Border created successfully",
            data: border
        });
        
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Failed to create border",
            error: error.message
        });
    }
};