const express = require('express')
const router = express.Router()
const { postimages } = require('../Controller/propertycontrol')
const {storage} = require('../utlis/cloudinary')
const multer = require('multer')
const upload = multer({storage})
router.post('/post',upload.array('images',6),postimages)
module.exports = router;