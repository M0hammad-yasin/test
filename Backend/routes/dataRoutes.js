const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  getLatestTemperature,
  getLatestHumidity,
  getLatestEC,
  getLatestPH,
  getLatestCO2,
  getLatestsolLevel,
  getWeeklySensorData,
  getStatus,
  postSensorData,
  postStatus,
  getLEDStatus,
} = require("../controllers/dataController");

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// Route to handle posting sensor data
router.post("/sensor-data/:sensorType", postSensorData);

// Route to fetch the latest temperature value
router.get("/sensor-data/temperature/latest", getLatestTemperature);

// Route to fetch the latest Humidity value
router.get("/sensor-data/humidity/latest", getLatestHumidity);

// Route to fetch the latest EC value
router.get("/sensor-data/EC/latest", getLatestEC);

// Route to fetch the latest pH value
router.get("/sensor-data/pH/latest", getLatestPH);

// Route to fetch the latest CO2 value
router.get("/sensor-data/co2/latest", getLatestCO2);

// Route to fetch the latest Solution Level
router.get("/sensor-data/solLevel/latest", getLatestsolLevel);

// Route to fetch the Past Week Sensor Data for Graph on Dashboard
router.get("/sensor-data/weekly-data", getWeeklySensorData);

// Right SideBar Component
// Route to get latest Status for timer and Sprinkler
router.get("/status/latest", getStatus);

// Route to post Status Value
router.post("/status/update", postStatus);

// LED Endpoints
// Route to get the current LED status
router.get("/led/status", getLEDStatus);

// Route to update the LED status

module.exports = router;
