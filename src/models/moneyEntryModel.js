const mongoose = require('mongoose');

const {Schema,model} = mongoose;

const moneyEntrySchema = new Schema({
    borderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Border', // Assuming there is a 'Border' model to populate
    },
    totalMoney : {
        type : String,
        default : 0
    },
    date : {
        type : Date,
    }
},{timestamps:true,versionKey:false});

const moneyEntryModel = model('Money-entry', moneyEntrySchema);

module.exports = moneyEntryModel;