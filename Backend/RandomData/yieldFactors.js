const axios = require("axios");

// Function to generate random weekly yield data
function generateRandomWeeklyYieldData() {
  return Math.floor(Math.random() * 6);
}

// Function to post weekly yield data to the endpoint
async function postWeeklyYieldData(weekStartDate, weekEndDate, plantYields) {
  try {
    await axios.post("http://localhost:3001/weekly-yield-data", {
      weekStartDate,
      weekEndDate,
      plantYields,
    });
    console.log("Posted weekly yield data:", {
      weekStartDate,
      weekEndDate,
      plantYields,
    });
  } catch (error) {
    console.error("Error posting weekly yield data:", error.message);
  }
}

// Function to generate and post random weekly yield data
function generateAndPostWeeklyYieldData() {
  setInterval(() => {
    const weekStartDate = new Date();
    const weekEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const plantYields = [
      { plant: "Lettuce", yieldValues: [generateRandomWeeklyYieldData()] },
      { plant: "Mint", yieldValues: [generateRandomWeeklyYieldData()] },
      { plant: "Coriander", yieldValues: [generateRandomWeeklyYieldData()] },
    ];

    postWeeklyYieldData(weekStartDate, weekEndDate, plantYields);
  }, 30000);
}

module.exports = {
  generateAndPostWeeklyYieldData,
  postWeeklyYieldData,
  generateRandomWeeklyYieldData,
};
