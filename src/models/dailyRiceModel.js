const mongoose = require('mongoose');

const {Schema,model} = mongoose;

const dailyRiceSchema = new Schema({
    borderId : {
        type : mongoose.Schema.Types.ObjectId,
    },
    pot : {
        type : String,
        default : 0
    },
    date : {
        type : Date,
    }
    

},{timestamps: true,versionKey:false});

const dailyRiceModel = model("daily-rice", dailyRiceSchema);

module.exports = dailyRiceModel;