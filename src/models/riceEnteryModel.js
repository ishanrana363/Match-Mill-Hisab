const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const riceSchema = new Schema({
    borderId : {
        type : mongoose.Schema.Types.ObjectId,
    },
    totalPot : {
        type : String,
        default : 0
    }
    
},{timestamps: true,versionKey:false});

const riceEnteryModel = model("rice-entery",riceSchema);

module.exports = riceEnteryModel;