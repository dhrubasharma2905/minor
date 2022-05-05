const express = require('express');
const { getlocation } = require('../Controller/geocoding');
const router = express.Router()
router.post('/geo',getlocation)
module.exports = router;