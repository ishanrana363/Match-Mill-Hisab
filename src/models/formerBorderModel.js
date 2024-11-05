const mongoose = require('mongoose');

const {Schema,model} = mongoose;

const formerBorderSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    img : {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone : {
        type: String,
        required: true,
        unique: true,
    },
    address : {
        type: String,
        required: true
    },
    father_name : {
        type: String,
        required: true
    },
    mother_name : {
        type: String,
        required: true
    },
    dob : {
        type : String,
        required: true
    },
    father_phone_number : {
        type: String,
        required: true
    },
    institute_name : {
        type: String,
        required: true
    }
},{timestamps:true,versionKey:false});

const formerBorderModel = model("formerBorder",formerBorderSchema);

module.exports = formerBorderModel;
