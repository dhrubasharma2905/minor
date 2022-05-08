const express = require('express');
const router = express.Router();
const { postimages, getAllProperties, getOneProperty, updateproperties, deleteProperties } = require('../Controller/propertycontrol');
const {storage} = require('../utlis/cloudinary');
const multer = require('multer');
const upload = multer({storage});
const { verifytoken, verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router.post('/add', verifytoken,upload.array('images',8),postimages);

router.get("/", getAllProperties);

router.get("/:id", getOneProperty);

router.put("/:id", upload.array('images',8), verifyTokenAndAuthorization ,updateproperties);

router.delete("/:id", verifyTokenAndAuthorization, deleteProperties)

module.exports = router;