const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dqvjwt1ej",
  api_key: "797987725955534",
  api_secret: "JFrErDqxPuv1xtao35U29QrWrRM",
});
exports.uploads = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({ url: result.url, id: result.public_id });
      },
      { resource_type: "auto" }
    );
  });
}