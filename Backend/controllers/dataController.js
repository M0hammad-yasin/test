const {
  CO2Data,
  pHData,
  HumidityData,
  ECData,
  temperatureData,
  solLevelData,
  Status,
  LED,
} = require("../mongoose");

// Post Sensor Data
const postSensorData = async (req, res) => {
  try {
    const { sensorType } = req.params;
    const { value } = req.body;
    let SensorModel;
    console.log(`Received sensor data: ${sensorType} - ${value}`);
    // Determine the model based on the sensor type
    switch (sensorType) {
      case "pH":
        SensorModel = pHData;
        break;
      case "EC":
        SensorModel = ECData;
        break;
      case "co2":
        SensorModel = CO2Data;
        break;
      case "solLevel":
        SensorModel = solLevelData;
        break;
      default:
        return res.status(400).json({ error: "Invalid sensor type" });
    }
    const newData = new SensorModel({ value });
    await newData.save();
    console.log(`Saved ${sensorType} sensor data to MongoDB`);
    res.status(201).json({ message: `Posted ${sensorType} sensor data ` });
  } catch (error) {
    console.error("Error posting sensor data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get the latest temperature data from MongoDB

const getLatestTemperature = async (req, res) => {
  try {
    // find latest temperature entry in database
    const latestTemperature = await temperatureData
      .findOne()
      .sort({ _id: -1 })
      .limit(1);

    if (!latestTemperature) {
      return res.status(404).json({ error: "Temperature data not found" });
    }

    const temperatureValue = latestTemperature.value;

    res.status(200).json({ temperature: temperatureValue });
  } catch (error) {
    console.error("Error fetching latest temperature:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get the latest temperature data from MongoDB

const getLatestHumidity = async (req, res) => {
  try {
    // find latest Humidity entry in database
    const latestHumidity = await HumidityData.findOne()
      .sort({ _id: -1 })
      .limit(1);

    if (!latestHumidity) {
      return res.status(404).json({ error: "Humidity data not found" });
    }

    const HumidityValue = latestHumidity.value;

    res.status(200).json({ Humidity: HumidityValue });
  } catch (error) {
    console.error("Error fetching latest Humidity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get the latest EC data from MongoDB
const getLatestEC = async (req, res) => {
  try {
    // find latest EC entry in database
    const latestEC = await ECData.findOne().sort({ _id: -1 }).limit(1);

    if (!latestEC) {
      return res.status(404).json({ error: "EC data not found" });
    }

    const ECValue = latestEC.value;

    res.status(200).json({ EC: ECValue });
  } catch (error) {
    console.error("Error fetching latest EC:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get the latest pH data from MongoDB
const getLatestPH = async (req, res) => {
  try {
    // find latest pH entry in database
    const latestPH = await pHData.findOne().sort({ _id: -1 }).limit(1);

    if (!latestPH) {
      return res.status(404).json({ error: "pH data not found" });
    }

    const PHValue = latestPH.value;

    res.status(200).json({ pH: PHValue });
  } catch (error) {
    console.error("Error fetching latest pH:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get the latest CO2 data from MongoDB
const getLatestCO2 = async (req, res) => {
  try {
    // find latest CO2 entry in database
    const latestCO2 = await CO2Data.findOne().sort({ _id: -1 }).limit(1);

    if (!latestCO2) {
      return res.status(404).json({ error: "CO2 data not found" });
    }

    const CO2Value = latestCO2.value;

    res.status(200).json({ CO2: CO2Value });
  } catch (error) {
    console.error("Error fetching latest CO2:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get the latest solLevel data from MongoDB
const getLatestsolLevel = async (req, res) => {
  try {
    // find latest Solution Level entry in database
    const latestsolLevel = await solLevelData
      .findOne()
      .sort({ _id: -1 })
      .limit(1);

    if (!latestsolLevel) {
      return res.status(404).json({ error: "SolLevel data not found" });
    }

    const solLevelValue = latestsolLevel.value;

    res.status(200).json({ solLevel: solLevelValue });
  } catch (error) {
    console.error("Error fetching latest Solution Level:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// function to calculate Average of Daily Sensor Values

const calculateDailyAverages = async (Model) => {
  // Calculate date threshold (7 days ago)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const dailyAverages = await Model.aggregate([
    {
      $match: {
        timestamp: { $gte: sevenDaysAgo }, // Filter documents from last 7 days
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        averageValue: { $avg: "$value" },
      },
    },
    {
      $sort: { _id: 1 }, // Sort by date ascending
    },
  ]);

  return dailyAverages.map((data) => ({
    date: data._id,
    value: data.averageValue,
  }));
};

// function to get last 7 days

const getLast7Days = async () => {
  const today = new Date();
  let days = [];

  for (let i = 6; i >= 0; i--) {
    let day = new Date(today);
    day.setDate(today.getDate() - i);
    days.push(day.toISOString().split("T")[0]);
  }
  return days;
};

// function to fetch Weekly Sensor Data

const getWeeklySensorData = async (req, res) => {
  try {
    const last7Days = await getLast7Days();

    const humidityData = await calculateDailyAverages(HumidityData);
    console.log(humidityData);
    const phData = await calculateDailyAverages(pHData);
    const ecData = await calculateDailyAverages(ECData);
    const co2Data = await calculateDailyAverages(CO2Data);

    // Filling missing data for specific dates
    const fillMissingDates = (data, dates) => {
      const dataMap = data.reduce((map, item) => {
        map[item.date] = item.value;
        return map;
      }, {});

      return dates.map((date) =>
        dataMap[date] !== undefined ? dataMap[date] : null
      );
    };

    const humidity = fillMissingDates(humidityData, last7Days);
    const ph = fillMissingDates(phData, last7Days);
    const ec = fillMissingDates(ecData, last7Days);
    const co2 = fillMissingDates(co2Data, last7Days);

    res.json({
      humidity,
      ph,
      ec,
      co2,
      dates: last7Days,
    });
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// function to post the latest timer and Sprinkler Values

const postStatus = async (req, res) => {
  try {
    const { timerComplete, sprinklerRun } = req.body;
    const status = await Status.findOne().sort({ _id: -1 }).exec();
    if (status) {
      status.timerComplete = timerComplete;
      status.sprinklerRun = sprinklerRun;
      await status.save();
      res.status(200).json(status);
    } else {
      const newStatus = new Status({ timerComplete, sprinklerRun });
      await newStatus.save();
      res.status(201).json(newStatus);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// function to fetch the latest timer and Sprinkler Values

const getStatus = async (req, res) => {
  try {
    const status = await Status.findOne().sort({ _id: -1 }).exec();
    if (status) {
      res.status(200).json(status);
    } else {
      res.status(404).json({ message: "No status found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// function to fetch and update led status

// const updateLEDStatus = async (req, res) => {
//   const { status } = req.body; // Expecting { status: true/false }

//   try {
//     // Update the LED status in MongoDB
//     const updatedLED = await LED.findOneAndUpdate(
//       {}, // Match the single LED document
//       { status, updatedAt: new Date() }, // Update status and timestamp
//       { new: true } // Return the updated document
//     );

//     // Send the updated LED status to the ESP8266 asynchronously
//     await sendLEDStatus(status); // Ensure we await this action

//     // Return the updated LED status to the client
//     res.status(200).json({ message: "LED status updated", updatedLED });
//   } catch (err) {
//     // Handle errors if the update or WebSocket send fails
//     res
//       .status(500)
//       .json({ error: "Failed to update LED status", message: err.message });
//   }
// };

const getLEDStatus = async (req, res) => {
  try {
    const led = await LED.findOne({});
    if (!led) {
      return res.status(404).json({ message: "LED status not found" });
    }
    res.status(200).json({ status: led.status, updatedAt: led.updatedAt });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch LED status" });
  }
};

module.exports = {
  postSensorData,
  // updateLEDStatus,
  getLEDStatus,
  getLatestTemperature,
  getLatestHumidity,
  getLatestEC,
  getLatestPH,
  getLatestCO2,
  getLatestsolLevel,
  getWeeklySensorData,
  getStatus,
  postStatus,
};
