const mongoose = require('mongoose')
const crypto = require('crypto')
const {ObjectId}=mongoose.Schema
const Property = require('../Models/property')
const uuidv1 = require('uuidv1')
const registerSchema = new mongoose.Schema(
    {
        firstname:{
            type:String,
            required:true,
            trim:true
        },
        lastname:{
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
        phonenumber:{
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
        salt:String,
    },{timestamps:true})

    registerSchema.post("findOneAndDelete", async doc => {
        if (doc) {
            await Property.deleteMany({
                _id: {
                    $in: doc.propertyid
                }
            });
        };
    });
    
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