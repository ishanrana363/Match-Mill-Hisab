const { default: mongoose } = require("mongoose");
const moneyEntryModel = require("../models/moneyEntryModel");
const vegetablesModel = require("../models/vegetableModel");
const QRCode = require('qrcode');


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
                date: 1,
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

exports.moneyCalculationby30Days = async (req, res) => {
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
        const vegetableData = await vegetablesModel.find({borderId: borderId});

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
                date: 1,
            }
        };

        const borderData = await moneyEntryModel.aggregate([
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            projectFields
        ]);
        const vegetableProjection = {
            $project: {
                borderData: {
                    name: "$borderData.name",
                    img: "$borderData.img",
                },
                millPrice: 1,
                date: 1,
                mill: 1
            }
        }
        const borderVegetableData = await vegetablesModel.aggregate([
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            vegetableProjection
        ]);

        // Filtering records based on the date range and calculating total pots
        const totalRicePot = totalRiceData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.totalMoney);
            }
            return total;
        }, 0);

        const totalVegetableData = vegetableData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.millPrice);
            }
            return total;
        }, 0);

        const totalMill = vegetableData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.mill);
            }
            return total;
        }, 0);

        const totalMillMoney = vegetableData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.millPrice);
            }
            return total;
        }, 0);

        
        const money = totalRicePot-totalVegetableData

        const qrImageUrl = await QRCode.toDataURL(`${totalMill} ${totalMillMoney} ${totalRicePot} ${money} ${borderData} ${borderVegetableData} `);


        res.status(200).send({
            status: "success",
            totalMill : totalMill, // মোট মিল
            millKhorajTka : parseFloat(totalMillMoney), // মোট মিল খরছ
            takaDisa : parseFloat(totalRicePot), // টাকা দিচ্ছে
            takaPaba: money, // টাকা পাবেন 
            takaDayarDate: borderData, // বডার টাকা দেওয়ার ইতিহাস
            millKayarDate : borderVegetableData, // বডার ভেজিটেবল ইতিহাস
            qrImg : qrImageUrl
        });

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }

}