const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const db = require('./Database/connection')
const bodyparser = require("body-parser")
const cookieParser = require('cookie-parser')
const expressValidator= require('express-validator')
app.use(bodyparser.json())
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  }));
app.use(morgan('dev'))
app.use(expressValidator()) // yesma kina vanda import garirakhnu pardyena tei vayera
app.use(cookieParser())
const Userroute = require('./Route/userrouter')
const Propertyroute = require('./Route/propertyrouter')
const Georoute = require('./Route/georoute')
app.use("/api",Userroute)
app.use('/api',Propertyroute)
app.use('/api',Georoute)
const port = process.env.PORT
 // kun route call garyeko tha hunxa 
app.listen(port,(req,res)=>{
    console.log("the server is connected")
})