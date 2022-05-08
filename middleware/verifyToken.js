const jwt = require("jsonwebtoken");
const Property = require("../Models/property");

const verifytoken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const settoken = authHeader.split(' ')[1]
    jwt.verify(settoken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(403).json({
          error: "invalid token"
        })
      }
      req.user = user;
      next()
    })
  } else {
    return res.status(401).json({
      error: "You are not authenticated"
    })
  }
}
const verifyTokenAndAuthorization = async (req, res, next) => {
  verifytoken(req, res, async () => {
    const foundProperty = await Property.findById(req.params.id);
    if (req.user.id === foundProperty.Postedby.toString()) {
      next()
    } else {
      return res.status(403).json({
        error: "you are not allowed to do that!"
      })
    }
  });
}
const verifyTokenAndUser = (req, res, next) => {
  verifytoken(req, res, () => {
    if(req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ error: "you are not allowed to do that" });
    }
  })
}
const verifyTokenAndAdmin = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.role) {
      next()
    } else {
      return res.status(403).json({
        error: "You are not allowed to do that"
      })
    }
  })
}


module.exports = {
  verifytoken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndUser
}