const { default: mongoose } = require("mongoose");
const riceEnteryModel = require("../models/riceEnteryModel");

exports.findOneBorderTotalRiceGivenService = async (req) => {
    try {
        let borderId = new mongoose.Types.ObjectId(req.body.borderId);
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        let matchStage = {
            $match: {
                borderId: borderId,
                createdAt: { $gte: startDate, $lte: endDate }
            }
        };

        // Join with border model 
        let joinWithBorderId = {
            $lookup: {
                from: "borders",
                localField: "borderId",
                foreignField: "_id",
                as: "border"
            }
        };



        const aggregationPipeline = [
            matchStage,
            joinWithBorderId,
            { $group: { _id: "$totalPot", sum: { $count: {} } } }
        ];

        let  data = await riceEnteryModel.aggregate(aggregationPipeline);

        data.forEach((item)=>{
            item.borderName = item.border[0].name;
        })



        return {
            status: "success",
            data: data
        };

    } catch (error) {
        return {
            status: "fail",
            message: error.message
        };
    }
};
exports.findOneBorderTotalRiceGiven = async (req, res) => {
    const { borderId, startDate, endDate } = req.body;

    // Mongoose ObjectId তৈরি করা
    const borderObjectId = new mongoose.Types.ObjectId(borderId);

    // Match stage তৈরি করা
    const matchStage = {
        $match: {
            borderId: borderObjectId,
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
    };

    try {
        // Joining with border model
        const joinWithBorderModel = {
            $lookup: {
                from: "borders", // border collection নাম
                localField: "borderId",
                foreignField: "_id",
                as: "borderData"
            }
        };

        // Unwind borderData
        const unwindBorderData = {
            $unwind: "$borderData"
        };

        // projection

        const projectFields = {
            $project: {
                borderData: {
                    name: "$borderData.name",
                    img: "$borderData.img", 
                },
                totalPot: 1,
                date : 1, 
            }
        };

        // Aggregation pipeline
        const aggregationPipeline = [
            matchStage,
            joinWithBorderModel,
            unwindBorderData,
            projectFields
        ];

        // Aggregation query
        const borderData = await riceEnteryModel.aggregate(aggregationPipeline);

        // Filtering records based on the date range and calculating total pots
        const totalRicePot = borderData.reduce((total, record) => {
            return total + parseInt(record.totalPot) || 0; // Parse and sum totalPot
        }, 0);

        res.status(200).send({
            status: "success",
            data: totalRicePot,
            borderDetails: borderData // Include joined border data if needed
        });

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
};
