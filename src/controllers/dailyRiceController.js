const dailyRiceModel = require("../models/dailyRiceModel");


exports.insertDailyRiceEntry = async (req, res) => {
    try {
        let reqBody = req.body;
        let dailyRice = await dailyRiceModel.create(reqBody);
        res.status(201).send({
            status: "success",
            data: dailyRice,
        });
    } catch (error) {
        return res.status(500).send({
            message: "Failed to insert daily rice",
            error: error.message,
        });
    }
};