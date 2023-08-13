const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// const accessToken = new Schema({
//     token: {
//         type: String,
//         default: ''
//     },
//     createAt: {
//         type: Date,
//         expires: 60 * 1 // 15 minutes
//     }
// })

const UserModel = new Schema({
    fullname: {
        type: String
    },
    password: {
        type: String
    },
    phone: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    refreshToken: {
        type: String,
        default: '',
        unique: true
    }

});
module.exports = mongoose.model("User", UserModel);