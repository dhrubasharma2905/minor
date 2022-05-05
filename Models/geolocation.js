const mongoose = require('mongoose')
const geoSchema = new mongoose.Schema(
    {
        latitude:{
            type:Number
        },
        longitude:
        {
            type:Number
        },
        city:{
            type:String
        },
        state:{
            type:String
        }
    }
)
module.exports = mongoose.model('Geos',geoSchema)