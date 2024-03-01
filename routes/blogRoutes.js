const router = require("express").Router();
const meddile = require("../middleware/authMiddleware");

const {
  getBlogs,
  addBlog,
  updateBlog,
  getBlogByID, uploadBlogImage, resizeBlogPhoto,
  deleteBlog,
} = require("../controllers/blogController");

router.route("/").post(meddile.protect, uploadBlogImage, resizeBlogPhoto, addBlog).get(meddile.protect, meddile.restrictTo("admin"), getBlogs);
router.route("/:id").patch(meddile.protect, meddile.restrictTo("admin"), uploadBlogImage, resizeBlogPhoto, updateBlog).get(meddile.protect, meddile.restrictTo("admin"), getBlogByID).delete(meddile.protect, meddile.restrictTo("admin"), deleteBlog);

module.exports = router;
