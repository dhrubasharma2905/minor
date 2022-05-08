const mongoose = require('mongoose')
const crypto = require('crypto')
const {ObjectId}=mongoose.Schema
const uuidv1 = require('uuidv1')

const pendingAppointmentSchema = new mongoose.Schema({
    requestingId: {
        type: ObjectId,
        ref: "Register",
    }, propertyId: {
        type: ObjectId,
        ref: "Property"
    }
});

const registerSchema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true
        },
        activeAppointment: [
            {
                type: ObjectId,
                ref: "Appointment"
            }
        ],
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        username:
        {
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
        },
        myAppointment: [{
            type: ObjectId,
            ref: "Appointment"
        }],
        phoneNumber:{
            type:Number,
            reuired:true
        },
        hash_password:{
            type:String,
            required:true,
            trim:true
        },
        role:{
            type:Number,
            default:0
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        images:[
            {
                url:String,
                filename:String
            }
        ],
        propertyid:[{
            type:ObjectId,
            ref:'Property'
        }],
        pendingAppointment: [ pendingAppointmentSchema ],
        salt:String,
    },{timestamps:true})
    
    registerSchema.virtual('password')
    .set(function(password){

        this._password = password
        this.salt=uuidv1()
        this.hash_password = this.encryption(password) // this chai lekhnu parxa kina vanda natra kun schema ko ho tha hudaina
    })
    .get(function()
        {
            return this._password
        }   
    )
    registerSchema.methods = {
        authenticate:function(plainText)
        {
            return this.encryption(plainText) === this.hash_password

        },
        encryption:function(password)
        {  
            if(!password) return ''
            try{
                return crypto 
                .createHmac('sha1',this.salt) // createHmac is predefinied  // sha1 is the algorithm
                .update(password) // diyeko password chai update hunu paryo
                .digest('hex')
            }
            catch(err)
            {
                return ''
            }
        }
    }
    module.exports = mongoose.model("Register",registerSchema)