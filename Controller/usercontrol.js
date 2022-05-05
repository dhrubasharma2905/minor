const User = require('../Models/userregister')
const cloudinary=require('../utlis/cloudinary')
const Token = require('../Models/tokenmodel')
const sendEmail = require('../utlis/setemail')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')
exports.userregisters = async(req,res) =>
{
        
    console.log(req.body, req.files);
    try{
        const findUser = await User.findOne({username:req.body.username})
        const image = await cloudinary.uploader.upload(req.file.path)
        console.log(findUser);
        if(findUser) {
            throw new Error("username already exists");
        } else {
            
            let user = new User(
                {
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    password:req.body.password,
                    email:req.body.email,
                    username:req.body.username,
                    phonenumber:req.body.phonenumber,
                    cloudinaryid:image.secure_url
                }
            )
            user = await user.save();
            if(!user){return res.status(400).json({error:"user not found"})}
            // let token = new Token(
            //     {
            //         token:crypto.randomBytes(16).toString('hex'),
            //         userId:user._id
            //     })
            // token = await token.save()
            // if(!token) { return res.status(400).json({error:"not found the token"})}
            // sendEmail({
            //     from:'newreply@ecommerce-api.com',
            //     to:user.email,
            //     subject:'Email Verification Link',
            //     text:`Hello,\n\n verify your email by clicking inthe link below:\n\n http:\/\/${req.headers.host}\/api/confirmation\/${token.token}`,
            //     //http://localhost:5000/api/confimation/abde245342d
            // })
            res.send(user)
        }
    } catch (e) {
          return res.status(404).json({ err: e.message });
}
}
// confirmation of email
// exports.postEmailConfirmation = (req,res) =>
// {
//     // suru ma token find garna paryo
//     Token.findOne({token:req.params.token},(error,token)=>{
//         if(error || !token){
//             return res.status(400).json({error:"invalid token or token may have expired"})
//         }
//     User.findOne({_id:token.userId},(error,user)=>{
//         if(error || !user){
//             return res.status(400).json({error:"sorry we are unable to find the valid user for this token"})
//         }
    
//     // if user is already verified then
//     if(user.isVerified)
//     {
//         return res.status(400).json({error:`email is already verified , login to continure`})
//     }
//     user.isVerified=true
//     user.save();
//     if(error){return res.status(400).json({error:error})}
//     res.json({msg:"congrats your email has been verified"})
// })
// })}
// signin process
exports.signIn = async(req,res)=>{
    const{email,password}=req.body
    // const email = req.body.email
    // const password = req.body.password
    // at first check if email is registerd or not
    const user = await User.findOne({email})
    if(!user) {return res.status(403).json({error:`sorry the email is not found`})}
    // if email is found then check the matching password for that
    if(!user.authenticate(password))
    {
        return res.status(400).json({error:`email and password doesnot match`})
    }
    // check if user is verified or not 
    // if(!user.isVerified){
    //     return res.status(400).json({error:`verify your email to continue`})
    // }
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET) // secret or private key should have value 
    // but not the string otherwise it will give error
    res.cookie('hellocookie',token,{expire:Date.now()+999999})

    // return user infromation to frontend
    const{_id,name,role}=user
    return res.json({token,user:{name,email,_id,role}})
}
exports.signout=(req,res) =>
{
    res.clearCookie('hellocookie')
    res.json({message:`signout success`})
}
// userlist
exports.userlist=async (req,res)=>
{
    const user = await User.find().select('-hash_password')
    if(!user)
    {
        return res.status(400).json({error:"user not found"})
    }
    res.send(user)

}
exports.singleuser = async(req,res) =>
{
    const user = User.findById(req.params.id).select('-hash_password')
    if(!user){return res.status(400).json({error:"the user is not found"})}
    res.send(user)
}
// resend email verification link
// exports.resendverificationemail = async(req,res) =>
// {
//     let user = await User.findOne({email:req.body.email})
//     if(!user){return res.status(400).json({error:"please register the email"})}
//     if(user.isVerified){return res.status(400).json({error:"the email is already verifed , login to continue"})}
//     // create token to store in database and send the verification link
//     let token = new Token({
//         token:crypto.randomBytes(16).toString('hex'),
//         userId:user._id
//     })
//     token = await token.save()
//     if(!token){return res.status(400).json({error:"token not found"})}
//     sendEmail({
//         from:'newreply@ecommerce-api.com',
//         to:user.email,
//         subject:'Email Verification Link',
//         text:`Hello,\n\n verify your email by clicking inthe link below:\n\n http:\/\/${req.headers.host}\/api/confirmation\/${token.token}`,
//         //http://localhost:5000/api/confimation/abde245342d
//     })
//     res.json({message:`verification link has been sent`})
// }
