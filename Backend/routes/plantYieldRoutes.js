const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  postWeeklyYieldData,
  getTotalYieldData,
  getWeeklyYieldData,
} = require("../controllers/yieldController");

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// Route to handle posting Weekly Yield data
router.post("/weekly-yield-data", postWeeklyYieldData);

// Route to handle fetching Total Yield data
router.get("/total-yield", getTotalYieldData);

// Route to handle fetching Weekly Yield data
router.get("/weekly-yield", getWeeklyYieldData);

module.exports = router;
