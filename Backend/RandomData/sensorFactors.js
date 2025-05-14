const axios = require("axios");

// Function to generate random sensor data
function generateRandomSensorData(sensorType) {
  let minValue, maxValue;

  switch (sensorType) {
    // case "humidity":
    //   minValue = 20;
    //   maxValue = 80;
    //   break;
    // case "temperature":
    //   minValue = 17;
    //   maxValue = 35;
    //   break;
    case "EC":
      minValue = 50;
      maxValue = 1000;
      break;
    case "co2":
      minValue = 100;
      maxValue = 500;
      break;
    case "pH":
      minValue = 1;
      maxValue = 7.5;
      break;
    case "solLevel":
      minValue = 50;
      maxValue = 750;
      break;
    default:
      console.error("Invalid sensor type");
      return null;
  }

  const randomValue = Math.random() * (maxValue - minValue) + minValue;

  const roundedValue = parseFloat(randomValue.toFixed(1));

  console.log(`Generated random ${sensorType} sensor data: ${roundedValue}`);
  return roundedValue;
}

// Function to post sensor data to the backend API
async function postSensorData(sensorType, value) {
  try {
    await axios.post(`http://localhost:3001/sensor-data/${sensorType}`, {
      value,
    });
    console.log(`Posted ${sensorType} sensor data: ${value}`);
  } catch (error) {
    console.error(`Error posting ${sensorType} sensor data:`, error.message);
  }
}

// Function to generate and post random sensor data every 30 seconds
async function generateAndPostSensorData() {
  setInterval(() => {
    // const humidity = generateRandomSensorData("humidity");
    // const temperature = generateRandomSensorData("temperature");
    const EC = generateRandomSensorData("EC");
    const co2 = generateRandomSensorData("co2");
    const pH = generateRandomSensorData("pH");
    const solLevel = generateRandomSensorData("solLevel");

    console.log(
      `Generated sensor data: humidity - EC - ${EC}, CO2 - ${co2}, pH - ${pH}, -solLevel ${solLevel}`
    );
    postSensorData("EC", EC);
    postSensorData("co2", co2);
    postSensorData("pH", pH);
    postSensorData("solLevel", solLevel);
  }, 30000); // 30 seconds interval
}

module.exports = {
  generateAndPostSensorData,
  postSensorData,
  generateRandomSensorData,
};
