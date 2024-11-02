const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const dailyRiceSchema = new Schema(
    {
        borderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Border', // Assuming there is a 'Border' model to populate
        },
        pot: {
            type: String, 
            default: 0,
        },
        entry_date: {
            type: Date,
            
        },
    },
    { timestamps: true, versionKey: false }
);

const dailyRiceEntryModel = model('DailyRice', dailyRiceSchema); // Changed to singular form for model naming convention

module.exports = dailyRiceEntryModel;
