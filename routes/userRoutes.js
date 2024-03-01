const router = require("express").Router();
const meddile = require("../middleware/authMiddleware");


const { getusers, Adduser, updateUser, getUserByID, deleteUser, deactive, uploadUserImage, resizeUserPhoto } = require("../controllers/userController");
const { signup, login } = require("../controllers/authController")

router.route("/").post(meddile.protect, meddile.restrictTo("admin"), uploadUserImage, resizeUserPhoto, Adduser).get(meddile.protect, meddile.restrictTo("admin"), getusers);
router.route("/:id").patch(meddile.protect, meddile.restrictTo("admin"), uploadUserImage, resizeUserPhoto, updateUser).get(meddile.protect, meddile.restrictTo("admin"), getUserByID).delete(meddile.protect, meddile.restrictTo("admin"), deleteUser)
// .patch(deactive)

router.route("/singUp").post(signup)
router.route("/login").post(login)

module.exports = router

