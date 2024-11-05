const { default: mongoose } = require("mongoose");
const moneyEntryModel = require("../models/moneyEntryModel");
const millModel = require("../models/millModel");
const QRCode = require('qrcode');
const riceEntryModel = require("../models/riceEnteryModel");
const dailyRiceEntryModel = require("../models/dailyRiceEntryModel");


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

        // total mill calculaitons for one border

        const millCalculation = await millModel.find({borderId : borderId});


        const totalMillOneEatenBorder = millCalculation.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.mill);
            }
        }, 0);

        const totalMillCost = millCalculation.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.millPrice);
            }
        }, 0);

        // money calculation one border 

        const totalMoney =await moneyEntryModel.find({borderId : borderId});

        const totalMoneyOneBorderGiven = totalMoney.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.totalMoney);
            }
        }, 0);

        const takaPaba = (totalMoneyOneBorderGiven) - (totalMillCost);

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
                millPrice: 1,
                date : 1
            }
        };

        const borderDataList = await millModel.aggregate([
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            projectFields
        ]);



        const qrImageUrl = await QRCode.toDataURL(
            `মোট মিল: ${totalMillOneEatenBorder} টা , মোট মিল খরচ: ${totalMillCost} টাকা , আপনি টাকা দিচ্ছেন: ${totalMoneyOneBorderGiven} টাকা , ${takaPaba > 0 ? `আপনি টাকা পাবেন: ${takaPaba}` : `আপনার কাছে টাকা পাবে: ${Math.abs(takaPaba)}`}`
        );


        res.status(200).json({
            status: 'success',
            totalMillEatenOneBorder: totalMillOneEatenBorder,
            totalMillCost : totalMillCost,
            totalMoneyOneBorderGiven : totalMoneyOneBorderGiven,
            takaPaba : takaPaba,
            qrImageUrl : qrImageUrl,
            data : borderDataList
        })
        

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }

}


exports.riceCalculationby30Days = async (req, res) => {

    try {
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

        // rice calculation border eaten rice

        const riceData = await dailyRiceEntryModel.find({ borderId: borderId });


        const totalEatenRiceOneBorder = riceData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.pot);
            }
            return total;
        }, 0);



        // total rice calculation border given rice

        const givenRiceData = await riceEntryModel.find({ borderId: borderId });

        const totalGivenRiceOneBorder = givenRiceData.reduce((total, record) => {
            const recordDate = new Date(record.date);
            if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
                return total + parseFloat(record.totalPot);
            }
            return total;
        }, 0);

        let chalPabane = (totalGivenRiceOneBorder) - (totalEatenRiceOneBorder);

        const joinWithBorderModel = {
            $lookup: {
                from: "borders",
                localField: "borderId",
                foreignField: "_id",
                as: "borderData"
            }
        };

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
        ]);



        const qrImageUrl = await QRCode.toDataURL(
            `মোট চাল দিচ্ছেন: ${totalGivenRiceOneBorder} পট , মোট চাল খাইচ্ছেন : ${totalEatenRiceOneBorder} পট , ${chalPabane > 0 ? `আপনি চাল পাবেন: ${chalPabane} পট ` : `আপনার কাছে চাল পাবে: ${Math.abs(money)} পট `}`
        );



        res.status(200).json({
            status: "success",
            totalEatenRiceOneBorder: totalEatenRiceOneBorder,
            totalGivenRiceOneBorder: totalGivenRiceOneBorder,
            chalPabane: chalPabane,
            borderDataList: borderData,
            qrImg: qrImageUrl
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: error.message
        })
    }
};