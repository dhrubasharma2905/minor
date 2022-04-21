const cloudinary=require('../utlis/cloudinary')
const User = require("../Models/property");
const _ = require('underscore') 
const fs = require('fs')
// flow kasari hunxa vanda euta array define garum 
// tyo array bhitra link halm cloudinary ko 
// palai palai push garum 
exports.postphots = async(req,res,next) =>
{
if (!req.files || _.isEmpty(req.files)) {
  return res.status(400).json({error:"the files is not found"})
}
const files = req.files;
try {
  let urls = [];
  let multiple = async (path) => await cloudinary.uploader.upload(path)
  console.log(`multiple:${multiple}`)
  for (const file of files) {
      const {path} = file;
      const newPath = await multiple(path);
      urls.push(newPath);
      fs.unlinkSync(path);
  }
  if (urls) {
      let user = new User(
        {
          multipleimage:urls
        }
      )

      let newuser = _.extend(user,{avatar:user.secure_url,cloudinary_id:user.public_id})
      await newuser
      .save()
          .then(saved => {
              return res.json(saved);
          }).catch(error => {
              return res.json(error);
          })

  }
  if (!urls) {
      return res.status(400).json({error:"the url is not found"})
  }

} catch (e) {
  console.log("err :", e);
  return next(e);
}}
// {
//   try{
//       const result = await cloudinary.uploader.upload(req.file.path)
//       let user = new User({
//         name:req.body.name,
//         avatar:result.secure_url,
//         cloudinary_id:result.public_id,
//       })
//       user = await user.save()
//       if(!user){return res.staus(400).json({error:"the user is not found"})}
//       else{return res.send(user)}
//   }catch(e){return res.status(400).json({err:e.message})}
// }
// exports.post("/posting", upload.multiple("files"), async (req, res) => {
//   try {
//     // Upload image to cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);

//     // Create new user
//     let user = new User({
//       name: req.body.name,
//       avatar: result.secure_url,
//       cloudinary_id: result.public_id,
//     });
//     // Save user
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     let user = await User.find();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     // Find user by id
//     let user = await User.findById(req.params.id);
//     // Delete image from cloudinary
//     await cloudinary.uploader.destroy(user.cloudinary_id);
//     // Delete user from db
//     await user.remove();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     let user = await User.findById(req.params.id);
//     // Delete image from cloudinary
//     await cloudinary.uploader.destroy(user.cloudinary_id);
//     // Upload image to cloudinary
//     let result;
//     if (req.file) {
//       result = await cloudinary.uploader.upload(req.file.path);
//     }
//     const data = {
//       name: req.body.name || user.name,
//       avatar: result?.secure_url || user.avatar,
//       cloudinary_id: result?.public_id || user.cloudinary_id,
//     };
//     user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     // Find user by id
//     let user = await User.findById(req.params.id);
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });
