const { default: mongoose } = require("mongoose");
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


exports.totalCalculationBazar = async (req, res) => {
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
        let totalBararData = await dailyBazarModel.find({ borderId: borderId });

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
                price: 1,
                itemName: 1,
                date: 1,

            }
        };

        const borderData = await dailyBazarModel.aggregate([
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            projectFields


        ])

        // Filtering records based on the date range and calculating total pots
        const totalBazarMoney = totalBararData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseInt(record.price);
            }
            return total;
        }, 0);


        res.status(200).send({
            status: "success",
            data: totalBazarMoney,
            dataTow: borderData
        });

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
};

exports.totalBazarList = async (req, res) => {
    const {startDate, endDate } = req.body;

    const matchStage = {
        $match: {
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }
    };

    try {
        // Fetching all rice entry records for the specified borderId
        let totalBazarData = await dailyBazarModel.find();

        console.log(totalBazarData);

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
                price: 1,
                itemName: 1,
                date: 1,

            }
        };

        const borderData = await dailyBazarModel.aggregate([
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            projectFields


        ])

        // Filtering records based on the date range and calculating total pots
        const totalBazarMoney = totalBazarData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseInt(record.price);
            }
            return total;
        }, 0);


        res.status(200).send({
            status: "success",
            data: totalBazarMoney,
            dataTow: borderData
        });

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
};