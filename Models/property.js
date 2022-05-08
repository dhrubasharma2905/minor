const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String,
});

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
    rooms: {
        type: Number,
        required: true,
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
    propertyFacing: {
        type: String,
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
    Postedby:{
        type:ObjectId,
        ref:'Register',
        required:true
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    appointment: {
        type: ObjectId,
        ref: "Appointment"
    },
    images: [ImageSchema],
    deleteimages:{type:[]}
},{timestamps:true})
module.exports = mongoose.model('Property',propertySchema)