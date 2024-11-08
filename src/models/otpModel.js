const mongoose = require('mongoose');

const {Schema,model} = mongoose;

const otpSchema = new Schema({
    email : {
        type: String,
    },
    otp : {
        type : Number
    },
    status : {
        type : Number,
        default : 0
    }
},{timestamps:true,versionKey:false});

const otpModel = model('otp', otpSchema);

module.exports = otpModel;