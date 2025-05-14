// src/mocks/weeklyData.js
const generateWeeklyData = () => {
  const dates = [];
  const today = new Date();

  // Generate dates for last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]); // YYYY-MM-DD format
  }

  // Generate realistic sensor data with daily variations
  const baseValues = {
    humidity: 60, // Starting humidity %
    ph: 6.0, // Starting pH
    ec: 2.0, // Starting EC mS/cm
    co2: 800, // Starting CO2 ppm
  };

  return {
    dates,
    humidity: dates.map((_, index) => {
      // Daily humidity fluctuation ±5%
      return Math.min(
        80,
        Math.max(
          40,
          baseValues.humidity + (Math.random() * 10 - 5) + index * 0.2
        )
      );
    }),
    ph: dates.map((_, index) => {
      // pH fluctuation ±0.2 with gradual drift
      return Number(
        (baseValues.ph + (Math.random() * 0.4 - 0.2) + index * 0.03).toFixed(2)
      );
    }),
    ec: dates.map((_, index) => {
      // EC fluctuation ±0.3 with gradual increase
      return Number(
        (baseValues.ec + (Math.random() * 0.6 - 0.3) + index * 0.05).toFixed(2)
      );
    }),
    co2: dates.map((_, index) => {
      // CO2 fluctuation ±100ppm with daily pattern
      return Math.floor(
        baseValues.co2 + (Math.random() * 200 - 100) + Math.sin(index) * 50
      );
    }),
  };
};

export const weeklyData = generateWeeklyData();
