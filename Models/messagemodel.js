const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema
const messageSchema = new mongoose.Schema(
    {
        chatroom:{
            type:ObjectId,
            ref:"Chat"
        },
        user:{
            type:ObjectId,
            ref:"Register"
        },
        message:{
            type:String,
        }
    }
)
module.exports = mongoose.model("Message",messageSchema)