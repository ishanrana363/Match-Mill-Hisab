const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String,
        default: 'https://api.adorable.io/avatars/285/default.png'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => /^(?:\+88|88)?01[3-9]\d{8}$/.test(v),
            message: '{VALUE} is not a valid phone number'
        }
    },
    password: {
        type: String,
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'border','super-admin','user'],
        default: 'user'
    },
    address: {
        type: String,
        required: true
    }

}, { timestamps: true, versionKey: false });

const User = model('User', userSchema);

module.exports = User;