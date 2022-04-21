const express = require('express')
const router = express.Router()
const upload= require("../utlis/multer");
const { postphots } = require('../Controller/propertycontrol');
router.post('/posting',upload.array("files"),postphots);
module.exports = router;