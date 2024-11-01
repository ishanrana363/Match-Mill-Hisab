const mongoose = require('mongoose');

const {Schema,model} = mongoose;

const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        set : (v)=> bcrypt.hashSync(v,bcrypt.genSaltSync(10)),
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'border'],
        default: 'user'
    },
    
},{timestamps: true,versionKey:false});

const User = model('User', userSchema);

module.exports = User;