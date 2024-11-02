const dailyBazarModel = require("../models/dailyBazarModel");

exports.dailyBazarInsert = async (req, res) => {
    try {
        let reqBody = req.body;
        let dailyBazar = await dailyBazarModel.create(reqBody);
        res.status(201).send({
            status: "success",
            data: dailyBazar,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "Failed to create daily bazaar entry",
        });
    }
};