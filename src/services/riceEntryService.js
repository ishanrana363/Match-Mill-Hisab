const riceEnteryModel = require("../models/riceEnteryModel");

exports.findOneBorderTotalReiceGiven = async ()=>{
    try {
        let borderTotalReiceGiven = await riceEnteryModel.aggregate([
            {
                $group: {
                    _id: "$borderId",
                    totalReiceGiven: { $sum: "$reice" }
                }
            }
        ]); 
}