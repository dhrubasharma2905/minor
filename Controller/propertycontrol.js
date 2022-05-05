const Property = require("../Models/property");
const {cloudinary}= require('../utlis/cloudinary')
const axios = require('axios');
exports.postimages = async(req,res) =>
{  
    const newProperty = new Property(req.body);
    console.log(req.files)
    newProperty.images=req.files.map(f=>({url:f.path,filename:f.filename,cloudinaryid:f.filename.slice(-20)}));
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
exports.updateproperties = async(req,res)=>
{
    
    const newbase = await Property.findByIdAndUpdate(req.params.id,{...req.body},{new:true})
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}))
    console.log(imgs)
    newbase.images.push(...imgs)
    await newbase.save();
    if(req.body.deleteimages)
    {
        
        for(let filename of req.body.deleteimages)
         {  console.log(filename)
            await cloudinary.uploader.destroy(filename)
         }
        await newbase.updateOne({$pull:{images:{filename:{$in:req.body.deleteimages}}}}) // to pull out the image from the database
        // which are selected from the front end
    }
    res.status(200).send('updated')
}
exports.deleteroperties = async(req,res)=>
{ 
  const imagearray = await Property.findById(req.params.id)
  for(let filename of imagearray.images)
  { 
    await cloudinary.uploader.destroy(filename.filename) // to access the filename of the images array to delete it under the loop
  }
   Property.findByIdAndDelete(req.params.id)
    .then(properties=>{
     if(!properties) {return res.status(400).json({error:"property not found"})}
     else {return res.status(400).json({message:"deleted successfully"})}
   })
   .catch(err=>
     {
       res.status(400).json({error:err})
     })
}
exports.getproperties = async(req,res) =>
{
  const properties = await Property.find().populate({path:'Postedby',select:'username'})
  if(!properties){return res.status(400).json({error:"the properties is not found"})}
  else res.send(properties)
}
exports.getsingleproperties = async(req,res)=>
{
  const properties = await Property.findById(req.params.id)
  if(!properties){return res.status(400).json({error:"the property is not found"})}
  else res.send(properties)
}
