const formerBorderModel = require("../models/formerBorderModel");


exports.allFormerBorder = async (req, res) => {
    try {
        let formerBorder = await formerBorderModel.find({});
        res.status(200).send({
            status: "success",
            data: formerBorder,
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
};

