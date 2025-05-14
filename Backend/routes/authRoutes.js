const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File name
  },
});

const upload = multer({ storage: storage });

const {
  registerUser,
  loginUser,
  authenticateUser,
  getProfile,
  logoutUser,
  updateProfile,
} = require("../controllers/authController");

// middlewares

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.get("/logout", authenticateUser, logoutUser);
router.put("/update", authenticateUser, upload.single("image"), updateProfile);

module.exports = router;
