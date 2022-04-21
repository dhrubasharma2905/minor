const mongoose = require('mongoose')
const {ObjectId} =mongoose.Schema

const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    userId:{
        type:ObjectId,
        ref:'Auth',
        required:true,
    },
    createdat:{
        type:Date,
        default:Date.now(),
        expires:86400
    }
})
module.exports = mongoose.model('token',tokenSchema)