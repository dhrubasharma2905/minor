const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const db = require('./Database/connection')
const bodyparser = require("body-parser")
const cookieParser = require('cookie-parser')
const expressValidator= require('express-validator')
app.use(bodyparser.json())
app.use(morgan('dev'))
app.use(expressValidator()) // yesma kina vanda import garirakhnu pardyena tei vayera
app.use(cookieParser())
const Userroute = require('./Route/userrouter')
const Propertyroute = require('./Route/propertyrouter')
app.use("/api",Userroute)
app.use('/api',Propertyroute)
const port = process.env.PORT
 // kun route call garyeko tha hunxa 
app.listen(port,(req,res)=>{
    console.log("the server is connected")
})