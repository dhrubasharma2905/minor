const Property = require("../Models/property");
const {cloudinary}= require('../utlis/cloudinary')
const axios = require('axios');
exports.postimages = async(req,res) =>
{  
    const newProperty = new Property(req.body);
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
    res.status(200).send(newProperty);
};
exports.updateimages = async(req,res)=>
{
    const {id} = req.params
    const newbase = await Property.findByIdAndUpdate(id,{...req.body})
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}))
    console.log(imgs)
    newbase.images.push(...imgs)
    await newbase.save();
    console.log(req.body.deleteimages)
    if(req.body.deleteimages)
    {
        for(let filename of req.body.deleteimages)
         {
            await cloudinary.uploader.destroy(filename)
         }
        await newbase.updateOne({$pull:{images:{filename:{$in:req.body.deleteimages}}}})
    }
    res.status(200).send('updated')
}

exports.getproperties = async(req,res) =>
{
  const properties = await Property.find().populate({path:'Postedby',select:'username'})
  if(!properties){return res.status(400).json({error:"the properties is not found"})}
  else res.send(properties)
}
