const blog = require("../models/blogsModel");
const sharp = require('sharp');
const { uploadOneImage } = require("../middleware/uploadImageMiddleware");

const categories = ["Fruits and Vegetables", "Protien", "Starchy Food"];

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    // console.log(query);
    this.queryString = queryString;
    // console.log(queryString);
  }


  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(this.queryString);
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    // console.log(this.queryString);
    const limit = 6 * 1 || 0;
    const skip = (page - 1) * limit;
    // console.log(page);
    // console.log(this.query);
    // console.log(limit)
    // console.log(skip);
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
  filter() {
    if (this.queryString.filter) {
      const filterBy = this.queryString.filter.split(',').join(' ');
      console.log(this.queryString);
      console.log(filterBy);
      if (filterBy === "All") {
        this.query = this.query.find();
      }
      else {
        this.query = this.query.find().where("category").equals(filterBy);
      }

    } else {
      this.query = this.query;
    }

    return this;
  }
}

const uploadBlogImage = uploadOneImage()
const resizeBlogPhoto = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `blog-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/${filename}`);
  //saveImage as string
  req.body.image = filename
  //saveImage as url
  // req.body.image = req.hostname+filename

  next();
};

async function addBlog(req, res, next) {
  if (!req.body.user) req.body.user = req.user.id;
  const { title, description, imageUrl, category, user, image } = req.body;
  try {
    const newBlog = new blog({
      title,
      description,
      imageUrl,
      category, user, image
    });

    const savednewBlog = await newBlog.save();
    res.status(201).json("blog added successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getBlogs(req, res, next) {
  try {
    const features = new APIFeatures(blog.find(), req.query).filter()
      .sort();
    // .paginate();
    // console.log(req.query);
    const blogs = await features.query;
    // const blogs = await blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateBlog(req, res) {
  const blogId = req.params.id;
  const updates = req.body;
  try {
    const updatedBlog = await blog.findByIdAndUpdate(blogId, updates, {
      new: true,
    });
    if (!updatedBlog) {
      return res.status(404).json({ message: "No blog found with that ID" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getBlogByID(req, res) {
  const blogId = req.params.id;
  try {
    const SpasificBlog = await blog.findById(blogId);
    if (!SpasificBlog) {
      return res.status(404).json({ message: "No blog found with that ID" });
    }
    res.status(200).json(SpasificBlog);
    // return blogId;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
async function deleteBlog(req, res) {
  try {
    const blogId = req.params.id;
    console.log(blogId);
    const deletedBlog = await blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ message: "No blog found with that ID" });
    }
    res.status(200).json({ message: "blog deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getBlogs,
  addBlog,
  updateBlog,
  getBlogByID,
  deleteBlog, uploadBlogImage, resizeBlogPhoto
};
