const riceEnteryModel = require("../models/riceEnteryModel");

exports.insertRiceEntry = async (req,res)=>{
    try {
        let reqBody = req.body;
        let riceEntry = await riceEnteryModel.create(reqBody);
        res.status(201).send({
            status: "success",
            data: riceEntry,
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: error.message,
        })
    }
};