import React, { useState, useEffect } from "react";
import axios from "axios";
import CanvasJSReact from "@canvasjs/react-charts";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function PlantsPieStats({ title, plantName }) {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    async function fetchYieldData() {
      try {
        const response = await axios.get("/weekly-yield");
        const { plantYields } = response.data;

        let plantData = [];
        const weekMap = new Map();

        // Process each week's data
        plantYields.forEach((week) => {
          if (Array.isArray(week.plantYields)) {
            const plantYield = week.plantYields.find(
              (data) => data.plant === plantName
            );
            if (plantYield) {
              const weekStartDate = new Date(week.weekStartDate);
              const weekNumber = getWeekNumber(weekStartDate);

              // Initialize or add to the total yield for this week
              if (!weekMap.has(weekNumber)) {
                weekMap.set(weekNumber, 0);
              }
              const totalYield = plantYield.yieldValues.reduce(
                (a, b) => a + b,
                0
              );
              weekMap.set(weekNumber, weekMap.get(weekNumber) + totalYield);
            }
          }
        });

        // Convert the week map to an array and sort by week number
        plantData = Array.from(weekMap.entries()).sort((a, b) => a[0] - b[0]);

        // Format the data points for the chart
        const formattedDataPoints = plantData.map(
          ([weekNumber, totalYield], index) => ({
            label: `Week ${index + 1}`,
            y: totalYield,
          })
        );

        setDataPoints(formattedDataPoints);
      } catch (error) {
        console.error("Error fetching weekly yield data:", error);
      }
    }

    fetchYieldData();
  }, [plantName]);

  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }

  const options = {
    title: {
      text: title,
    },
    data: [
      {
        type: "pie",
        showInLegend: true,
        legendText: "{label}",
        toolTipContent: "{label}: <strong>{y}g</strong>",
        indexLabel: "{y}g",
        indexLabelPlacement: "inside",
        dataPoints: dataPoints,
      },
    ],
  };

  return (
    <div className="col-12 col-lg-4 col-md-4 col-sm-12">
      <CanvasJSChart options={options} />
    </div>
  );
}

function PieChart() {
  return (
    <div className="row stats">
      <PlantsPieStats title="Lettuce" plantName="Lettuce" />
      <PlantsPieStats title="Mint" plantName="Mint" />
      <PlantsPieStats title="Coriander" plantName="Coriander" />
    </div>
  );
}

export default PieChart;
