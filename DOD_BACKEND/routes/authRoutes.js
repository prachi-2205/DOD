var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // return cb(null, process.env.FILE_UPLOAD_PATH);
    // const uploadPath = process.env.FILE_UPLOAD_PATH;
    const uploadPath = path.join(__dirname, "../public/images/uploads");
    // Check if the directory exists, create it if not
    fs.mkdir(uploadPath, { recursive: true }, function (err) {
      if (err) {
        const err = new Error("common");
        err.error = "common";
        err.statusCode = 406;
        throw err;
      }
      // Set the destination for storing files
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    return cb(null, `${uniqueSuffix + "-" + file.originalname}`);
  },
});

const uploads = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 },
});
const {
  registerUser,
  login,
  logout,
  forgotPassword,
  changePassword,
  verifyEmail,
  resetPassword,
  verifyCode,
  setUpProfile,
  profileImage,
} = require("../Controller/registerController");

router.post("/register", registerUser);
router.post("/verifyCode", verifyCode);
router.post("/login", login);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/change-password", changePassword);

router.get("/verify-email", verifyEmail);

router.post("/setup-profile", setUpProfile);

router.post(
  "/upload/:entityType/:entityId",
  uploads.single("file"),
  profileImage
);

module.exports = router;
