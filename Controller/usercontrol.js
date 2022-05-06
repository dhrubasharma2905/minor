const User = require('../Models/userregister')
const jwt = require('jsonwebtoken')
exports.userregisters = async(req,res) =>
{   
    try{   
        console.log(req.files)
        const findUser = await User.findOne({username:req.body.username})
        console.log(findUser);
        if(findUser) {
            throw new Error("username already exists");
        } else {
            let user = new User(req.body);
            user.images=req.files.map(f=>({url:f.path,filename:f.filename}));
            user = await user.save();
            if(!user){return res.status(400).json({error:"user not found"})}
            else res.send(user)
        }
    } catch (e) {
          return res.status(404).json({ err: e.message });
}
}
exports.signIn = async(req,res)=>{
    
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
    const{password,...others}=user._doc
    return res.json({accesstoken,...others})
}

exports.signout=(req,res) =>
{
    res.clearCookie('hellocookie')
    res.json({message:`signout success`})
}
// userlist
exports.userlist=async (req,res)=>
{
    const user = await User.find(req.params.id).select('-hash_password')
    if(!user)
    {
        return res.status(400).json({error:"user not found"})
    }
    res.send(user)

}
exports.singleuser = async(req,res) =>
{
    const user = await User.findById(req.params.id).select('-hash_password')
    if(!user){return res.status(400).json({error:"the user is not found"})}
    res.send(user)
}

