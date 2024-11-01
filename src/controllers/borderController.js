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

exports.borderUpdate = async (req,res)=>{
    try {
        let borderId = req.params.borderId;
        let reqbody = req.body;
        let border = await borderModel.findByIdAndUpdate(borderId, reqbody, {new: true});
        if(!border){
            return res.status(404).json({
                status: "fail",
                msg: "Border not found"
            });
        }
        res.status(200).json({
            status: "success",
            msg: "Border updated successfully",
            data: border
        });
        
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Failed to update border",
            error: error.message
        });
    }
};

exports.borderDelete = async (req,res)=>{
    try {
        let borderId = req.params.borderId;
        let border = await borderModel.findByIdAndDelete(borderId);
        if(!border){
            return res.status(404).json({
                status: "fail",
                msg: "Border not found"
            });
        }
        res.status(200).json({
            status: "success",
            msg: "Border deleted successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Failed to delete border",
            error: error.message
        });
    }
};