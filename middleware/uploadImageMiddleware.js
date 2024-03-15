const multer = require("multer");

const uploadOneImage = () => {
  //   console.log("ok multer");

  const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
      newName = `blog-${Date.now()}.jpeg`
      cb(null, newName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  const upload = multer({ storage, fileFilter });
  return upload.single("image")
  // return upload
}

module.exports = {
  uploadOneImage

}