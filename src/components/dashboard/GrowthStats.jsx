import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { weeklyData } from "../statistics/weeklydata";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GrowthStats() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/sensor-data/weekly-data");
        const { humidity, ph, ec, co2, dates } = weeklyData;
        console.log("Weekly data:", response.data);

        const data = {
          labels: dates,
          datasets: [
            {
              label: "Humidity",
              data: humidity,
              borderColor: "rgb(75, 192, 192)",
              spanGaps: true,
            },
            {
              label: "pH",
              data: ph,
              borderColor: "rgb(192, 75, 192)",
              spanGaps: true,
            },
            {
              label: "EC",
              data: ec,
              borderColor: "rgb(192, 192, 75)",
              spanGaps: true,
            },
            {
              label: "CO2",
              data: co2,
              borderColor: "rgb(75, 75, 192)",
              spanGaps: true,
            },
          ],
        };

        setChartData(data);
      } catch (error) {
        console.error("Error fetching weekly data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    maintainAspectRatio: false,
    aspectRatio: 2,
    layout: {
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    },
  };

  return (
    <div className="text-center growthStats shadow">
      {chartData ? <Line options={options} data={chartData} /> : "Loading..."}
    </div>
  );
}

export default GrowthStats;
