const User = require("../models/userModel");
// const http=require("http")
const jwt = require("jsonwebtoken")

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


async function signup(req, res, next) {
  const { name, email, password, passwordConfirm, active } = req.body;

  try {
    const newUser = new User({ name, email, password, passwordConfirm, active });
    const savedNewUser = await newUser.save();
    
    const token = signToken(savedNewUser._id);

    res.status(201).header("Authorization", `Bearer ${token}`).json({
      success: true,
      message: "Sign up successful",
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}





async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPass(password, user.password))) {
      return res.status(401).json({ error: "Email or password is not correct" });
    }

    const token = signToken(user.id);
    res.header("Authorization", `Bearer ${token}`);
    res.status(200).json({ success: true, message: "Login successful", token, role: user.role , userName: user.name });
  } catch (error) {
    res.status(401).json({ error: "Email or password is not correct" });
  }
}


module.exports = {
  signup, login

}
