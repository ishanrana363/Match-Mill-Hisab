const moneyEntryModel = require("../models/moneyEntryModel");

exports.insertMoneyEntry = async (req, res) => {
    try {
        let reqBody = req.body;
        let moneyEntry = await moneyEntryModel.create(reqBody);
        return res.status(201).send({
            status: "success",
            data: moneyEntry,
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Failed to create money entry",
        });
    }
};