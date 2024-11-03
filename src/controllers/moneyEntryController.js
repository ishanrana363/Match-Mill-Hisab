const { default: mongoose } = require("mongoose");
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

exports.moneyCalculation = async (req, res) => {
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
        let totalRiceData = await moneyEntryModel.find({ borderId: borderId });

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
                totalMoney: 1,
                date : 1,
            }
        };

        const borderData = await moneyEntryModel.aggregate([
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            projectFields


        ])

        // Filtering records based on the date range and calculating total pots
        const totalRicePot = totalRiceData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.totalMoney);
            }
            return total;
        }, 0);


        res.status(200).send({
            status: "success",
            data: totalRicePot,
            dataTow: borderData
        });

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
};