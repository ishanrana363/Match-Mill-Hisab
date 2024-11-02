const { response } = require("express");
const riceEnteryModel = require("../models/riceEnteryModel");
const findOneBorderTotalReiceGivenService = require("../services/riceEntryService");
const { default: mongoose } = require("mongoose");

exports.insertRiceEntry = async (req, res) => {
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

exports.findOneBorderTotalRiceGiven = async (req, res) => {
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
        let totalRiceData = await riceEnteryModel.find({ borderId: borderId });

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
                totalPot: 1,
                date: 1,
            }
        };

        const borderData = await riceEnteryModel.aggregate([
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            projectFields


        ])

        // Filtering records based on the date range and calculating total pots
        const totalRicePot = totalRiceData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseInt(record.totalPot);
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

