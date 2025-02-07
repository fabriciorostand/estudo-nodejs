const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: String, 
        enum: ['admin', 'user'],
        default: 'user',
    },
    name: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlenght: 8,
    },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;