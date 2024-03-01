const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { promisify } = require("util");
async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(res.status(401).json({ error: "You are not logged in! Please log in to get access" }))
  }
  decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // res.status(401).json({ error: "invalid token" });
  console.log(decode);
  if (!decode) {
    return next(res.status(400).json({ error: 'token is not true' }))
  }
  const stillUser = await User.findById(decode.id);
  if (!stillUser) {
    return next(res.status(401).json({ error: 'user is no longer exist' }))
  }
  if (stillUser.changPassword(decode.iat)) {
    return next(
      res.status(401).json({ error: 'User recently changed password! Please log in again.' })
    );
  }

  req.user = stillUser;
  next();

}
function restrictTo(role) {
  return (req, res, next) => {
    if ((req.user.role) !== role) {
      return next(
        res.status(403).json({ error: 'You do not have permission to perform this action' })
      );
    }

    next();
  };
};

module.exports = {
  protect, restrictTo

}