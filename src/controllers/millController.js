const { default: mongoose } = require("mongoose");
const millModel = require("../models/millModel");

exports.millUpload = async (req, res) => {
    try {
        let reqbody = req.body;
        let vegetable = await millModel.create(reqbody);
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

exports.findOneBorderTotalEtatenMill = async (req, res) => {
    const { borderId, startDate, endDate } = req.body;

    const matchStage = {
        $match: {
            borderId: new mongoose.Types.ObjectId(borderId),
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }

        }
    };

    try {
        // Fetching all rice entry records for the specified borderId
        let totalRiceData = await vegetableModel.find({ borderId: borderId });

        const joinWithBorderModel = {
            $lookup: {
                from: "borders",
                localField: "borderId",
                foreignField: "_id",
                as: "borderData"
            }
        };
        // unwind borderData
        const unwindBorderData = {
            $unwind: "$borderData"
        };

        const projectFields = {
            $project: {
                borderData: {
                    name: "$borderData.name",
                    img: "$borderData.img",
                },
                mill: 1,
                date: 1,
                millPrice : 1
            }
        };

        const borderData = await vegetableModel.aggregate([
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            projectFields


        ])

        // Filtering records based on the date range and calculating total pots
        const totalRicePot = totalRiceData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.millPrice);
            }
            return total;
        }, 0);

        const totalMill = totalRiceData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.mill);
            }
            return total;
        }, 0);

        res.status(200).send({
            status: "success",
            data: totalRicePot,
            dataThree : parseFloat(totalMill),
            dataTow: borderData,
        });

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
};


