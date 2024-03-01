const multer = require("multer");

const uploadOneImage = () => {

  const storage = multer.memoryStorage(
    //   {
    //   destination: function (req, file, cb) {
    //     cb(null, "uploads/user");
    //   }, filename: function (req, file, cb) {
    //     const extention = file.mimetype.split("/")[1];
    //     newName = `user-${Date.now()}.${extention}`
    //     cb(null, newName);
    //   },

    // }
  );
  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      cb(res.status(400).json({ message: 'image allowed' }), false)
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload.single("image")
}




module.exports = {
  uploadOneImage

}