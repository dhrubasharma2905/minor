const mongoose = require('mongoose')
const { array } = require('../utlis/multer')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    avatar:{
        type:String,
    },
    cloudinary_id:{
        type:String
    },
    multipleimage:{
        type:[]
    }
})
module.exports = mongoose.model('Property',userSchema)