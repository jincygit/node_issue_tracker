const mongoose = require('mongoose');


const changePasswordUserSchema = new mongoose.Schema({
    // user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    access_token: {
        type: String,
        required: true
    },
    //  validity status
    isVallid: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

const ChangePasswordUser = mongoose.model('ChangePasswordUser', changePasswordUserSchema);
module.exports = ChangePasswordUser;
