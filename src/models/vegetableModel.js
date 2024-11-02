const mongoose = require('mongoose');

const {Schema,model} = mongoose;

const vegetableSchema = new Schema({
    borderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Border', // Assuming there is a 'Border' model to populate
    },
    mill : {
        type : String,
    },
    millPrice : {
        type : String,
    },
    date : {
        type : Date,
    }
},{timestamps: true,versionKey:false});

const vegetableModel = model('Vegetable', vegetableSchema);

module.exports = vegetableModel;
