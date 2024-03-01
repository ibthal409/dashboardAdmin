const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
// const categories = ["Fruits and Vegetables", "Protien", "Starchy Food", "All"];

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    enum: ["Fruits and Vegetables", "Protien", "Starchy Food", "All"],
    // required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
},

  {

    timestamps: true
  }
);

const Blog = mongoose.model("Blogs", blogSchema);
module.exports = Blog;
