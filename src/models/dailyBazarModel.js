const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const dailyBazarSchema = new Schema({
    borderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Border', // Assuming there is a 'Border' model to populate
    },
    date: {
        type: Date,
        default: Date.now,
    },
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });

const dailyBazarModel = model('daily-bazar', dailyBazarSchema);

module.exports = dailyBazarModel;