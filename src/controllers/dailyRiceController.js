const { default: mongoose } = require("mongoose");
const dailyRiceEntryModel = require("../models/dailyRiceEntryModel");


exports.insertDailyRiceEntry = async (req, res) => {
    try {
        let reqBody = req.body;
        let dailyRice = await dailyRiceEntryModel.create(reqBody);
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

exports.findOneBorderTotalEatenRice = async (req, res) => {
    const { borderId, startDate, endDate } = req.body;

    const matchStage = {
        $match: {
            borderId: new mongoose.Types.ObjectId(borderId),
            entry_date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }

        }
    };

    try {
        // Fetching all rice entry records for the specified borderId
        let totalRiceData = await dailyRiceEntryModel.find({ borderId: borderId });

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
                pot: 1,
                date: 1,
            }
        };

        const borderData = await dailyRiceEntryModel.aggregate([
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            projectFields


        ])

        // Filtering records based on the date range and calculating total pots
        const totalRicePot = totalRiceData.reduce((total, record) => {
            const recordDate = new Date(record.entry_date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.pot);
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