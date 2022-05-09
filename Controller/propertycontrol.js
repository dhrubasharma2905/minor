const Property = require("../Models/property");
const Appointment = require("../Models/appointments");
const User = require("../Models/userregister");
const {cloudinary}= require('../utlis/cloudinary')
const { stringify } = require("flatted");
const axios = require('axios');
exports.postimages = async(req,res) =>
{  
  const newProperty = new Property(req.body);
  newProperty.Postedby = req.user.id;
  const foundUser = await User.findById(req.user.id);
  newProperty.images=req.files.map(f=>({url:f.path,filename:f.filename}));
  const params = {
    auth: '388475087947669536643x61803',
    locate:req.body.propertyLocation,
    json: '1'
  }
  const response= await axios.get("http://geocode.xyz", {params});
  if(response?.status === 200) {
    newProperty.latitude=response.data.latt;
    newProperty.longitude=response.data.longt;
  }
  await newProperty.save();
  foundUser.propertyid.push(newProperty._id);
  await foundUser.save();
  res.status(200).send({ newProperty, foundUser });
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.getAllProperties = async(req,res) =>
{
  if(Object.keys(req.query).length === 0){
    const property = await Property.find().sort({createdAt:-1}).populate({path:'Postedby',select:'_id'})
    if(!property){return res.status(400).json({error:"the properties is not found"})}
    else res.send(property)
  }
  else{
    console.log(req.query);
    const queryString = req.query.q;
    const queryStrings = queryString.split(" ")
    allQueries =[]
    queryStrings.forEach(element => {
        allQueries.push({propertyLocation:{$regex : String(element),$options: 'i'}})
    });
    const property = await Property.find({$or : allQueries})
    if(!property || property.length === 0) res.status(400).send({error : "No preperty listed in this area"})
    else {return res.status(200).send(property) }
  }
};

exports.getOneProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("Postedby");
    if(!property) throw new Error("property not found");
    res.status(200).send(property)
  } catch (e) {
    res.status(404).send({ "error": e.message });
  }
}

exports.updateproperties = async(req,res) =>
{
  try {
    console.log(req.files);
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id,{...req.body},{new:true})
    const newImages = req.files.map(f=>({url:f.path,filename:f.filename}));
    updatedProperty.images.push(...newImages);
    const params = {
      auth: '388475087947669536643x61803',
      locate:req.body.propertyLocation,
      json: '1'
    }
    const response= await axios.get("http://geocode.xyz", {params});
    if(response?.status === 200) {
      updatedProperty.latitude=response.data.latt;
      updatedProperty.longitude=response.data.longt;
    }
    await updatedProperty.save();
    if(req.body.deleteImages)
    {
        
        for(let filename of req.body.deleteImages)
          {  console.log(filename)
            await cloudinary.uploader.destroy(filename)
          }
        await updatedProperty.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}}) // to pull out the image from the database
        // which are selected from the front end
    }
    res.status(200).send('updated')
  } catch(e) {
    res.status(404).json({ error: e.message });
  }
}

exports.deleteProperties = async(req,res) => {
  try {
    const foundProperty = await Property.findById(req.params.id);
    for (let value of foundProperty.images) {
      await cloudinary.uploader.destroy(value.filename);
  };
  await Property.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted successfully");
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}