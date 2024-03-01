const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },phone:{
    type: String,
    // required:true
  },
  age:{
    type: Number,
    // required:true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    // required: true,
    validate: {
      validator: function (el) {
        return el === this.password
      }
    }
  },

  active: {
    type: Boolean,
    default: true,
    // select: false
  },
  passwordChangedAt: {
    type: Date,
    // required: true
  }, image: {
    type: String,
    default: "default.jpg"

  }
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash cost 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPass = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
