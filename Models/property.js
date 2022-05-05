const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema
const propertySchema = new mongoose.Schema({
    propertyLocation:{
        type:String,
        required:true,
        trim:true
    },
    propertyType:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    propertyHeading:{
        type:String,
        required:true,
        trim:true
    },
    propertyArea:{
        type:Number,
        trim:true
    },
    propertyName:{
        type:String,
        trim:true
    },
    kitchen:{
        type:Number,
        trim:true
    },
    bedRoom:{
        type:Number,
        trim:true
    },
    hall:{
        type:Number,
        trim:true
    },
    Postedby:{
        type:ObjectId,
        ref:'Register',
    },
    latitude:{
        type:Number
    },
    longitude:{
        type:Number
    },
    additionalFeatures:{
        type:String,
        required:true,
        trim:true
    },
    images:
        [{
            url:String,
            filename:String,
            cloudinaryid:String,
        }]
    
},{timestamps:true})
module.exports = mongoose.model('Property',propertySchema)