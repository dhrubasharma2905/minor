exports.registerationvalidation = (req,res,next) =>
{
    req.check('firstname',"firstname is required").notEmpty()
    // tyo agadi ko firstname chai hamro userregister model
    // bata lekhya ho
    req.check('lastname',"lastname is required").notEmpty()
    req.check('username',"Username is required").notEmpty()
    req.check('phonenumber',"Phone number should be string").notEmpty()
    .withMessage("The number should not be string")
    req.check('email',"email is required").isEmail()
    .withMessage("please enter the correct format of email")
    req.check('password',"password is required").notEmpty()
    .isLength({
         min:9
     })
    .withMessage("password should be more than 9 character")
    const errors = req.validationErrors()
    if(errors)
    {
        const showError = errors.map(err=>err.msg)[0]
        return res.status(400).json({error:showError})
    }
    next()
}