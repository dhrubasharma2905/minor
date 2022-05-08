const Property = require("../Models/property");
const User = require('../Models/userregister')
const {cloudinary}= require('../utlis/cloudinary')
const axios = require('axios');
const { stringify } = require("flatted");
exports.postimages = async(req,res) =>
{  
    const newProperty = new Property(req.body);
    newProperty.Postedby = req.user.id;
    const foundUser = await User.findById(req.user.id);
    if(!foundUser) throw new Error("you are not logged in");
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
    foundUser.propertyid.push(newProperty._id);
    await foundUser.save();
    res.status(200).send({ newProperty, foundUser });
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
  if(Object.keys(req.query).length === 0){
    const property = await Property.find().sort({createdAt:-1}).populate({path:'Postedby',select:'_id'})
    if(!property){return res.status(400).json({error:"the properties is not found"})}
    else res.send(property)
  }
  else{
    const queryString = req.query.q
    const queryStrings = queryString.split(" ")
    allQueries =[]
    queryStrings.forEach(element => {
        allQueries.push({propertyLocation:{$regex : String(element),$options: 'i'}})
    });
    const property = await Property.find({$or : allQueries})
    if(!property || property.length === 0) res.status(400).send({error : "No preperty listed in this area"})
    else {return res.status(200).send(property) }
  }
}

exports.getsingleproperties = async(req,res)=>
{
  const properties = await Property.findById(req.params.id)
  if(!properties){return res.status(400).json({error:"the property is not found"})}
  else res.send(properties)
}
