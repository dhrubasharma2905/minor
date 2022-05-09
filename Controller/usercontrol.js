const User = require('../Models/userregister')
const jwt = require('jsonwebtoken')

exports.userregisters = async(req,res) =>
{    
    try{   
        console.log(req.body, req.file);
        const findUser = await User.findOne({username:req.body.username})
        if(findUser) {
            throw new Error("username already exists");
        } else {
            let user = new User(req.body);
            user.images={
                url: req.file.path,
                filename: req.file.filename
            };
            user = await user.save();
            if(!user){return res.status(400).json({error:"user not found"})}
            const accesstoken = jwt.sign({
                id:user._id,
                role:user.role
            },process.env.JWT_SECRET,{expiresIn:'1d'});
        
            // return user infromation to frontend
            const{password, hash_password, salt, ...others}=user._doc
            return res.json({accesstoken,...others})
        }
    } catch (e) {
          return res.status(404).json({ err: e.message });
}
}
exports.signIn = async(req,res)=>{
    console.log(req.body);
    const email =req.body.email
    const originalpassword = req.body.password
    const user = await User.findOne({email:email})
    if(!user) {return res.status(403).json({error:`sorry the email is not found`})}
    if(!user.authenticate(originalpassword))
    {
        return res.status(400).json({error:`email and password doesnot match`})
    }
    const accesstoken = jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET,{expiresIn:'1d'});

    // return user infromation to frontend
    const{password, hash_password, salt, ...others}=user._doc
    return res.json({accesstoken,...others})
}

exports.signout=(req,res) =>
{
    
}
// userlist
exports.userlist=async (req,res)=>
{
    const user = await User.find(req.params.id).select('-hash_password').populate("activeAppointment");
    if(!user)
    {
        return res.status(400).json({error:"user not found"})
    }
    res.send(user)

}
exports.deleteuser = async(req,res)=>
{
    
}
exports.updateuser = async(req,res)=>
{
      const user = await User.findByIdAndUpdate(req.params.id,{...req.body},{new:true})
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}))
    console.log(imgs)
 user.images.push(...imgs)
    await user.save();
    if(req.body.deleteimages)
    {
        
        for(let filename of req.body.deleteimages)
         {  console.log(filename)
            await cloudinary.uploader.destroy(filename)
         }
        await user.updateOne({$pull:{images:{filename:{$in:req.body.deleteimages}}}}) // to pull out the image from the database
        // which are selected from the front end
    }
    res.status(200).send('updated')
}
exports.singleuser = async(req,res) =>
{
    // const user = await User.findById(req.params.id).select('-hash_password').populate("activeAppointment").populate("peddingAppintment.requestingId").populate();
    const user = await User.findById(req.params.id).select("-hash_password").populate([{
        path: "pendingAppointment.requestingId",
        ref: "Register",
        select: ["_id", "username", "email", "images"]
    }, {
        path: "activeAppointment"
    }, {
        path: "pendingAppointment.propertyId",
        ref: "Property",
        select: ["_id", "propertyName", "images", "propertyLocation"]
    }, {
        path: "myAppointment"
    }, {
        path: "propertyid"
    }])
    if(!user){return res.status(400).json({error:"the user is not found"})}
    res.send(user)
}

