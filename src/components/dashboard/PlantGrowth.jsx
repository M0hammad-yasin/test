import React, { useState, useEffect } from "react";
import axios from "axios";

function Plant({ name, img, yieldAmount }) {
  return (
    <div className="d-flex align-items-center justify-content-between plantYield">
      <p>{name}</p>
      <img src={img} alt={`${name}_img`} className="px-3 img-fluid" />
      <p>Yield: {yieldAmount}g</p>
    </div>
  );
}

function PlantGrowth() {
  const [yieldData, setYieldData] = useState([]);

  useEffect(() => {
    async function fetchYieldData() {
      try {
        const response = await axios.get("/total-yield");
        setYieldData(response.data);
      } catch (error) {
        console.error("Error fetching total yield data:", error);
      }
    }

    fetchYieldData();

    const intervalId = setInterval(fetchYieldData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const plantImages = {
    Lettuce: "assets/images/lettuce.png",
    Mint: "assets/images/mint.png",
    Coriander: "assets/images/coriander.png",
  };

  return (
    <div className="text-center p-5 d-flex justify-content-around shadow plantGrowth">
      <img
        src="assets/images/tower.png"
        style={{ height: "300px" }}
        alt="envConditions"
        className="img-fluid"
      />
      <div className="align-content-center">
        {yieldData.map((plant) => (
          <Plant
            key={plant._id}
            name={plant._id}
            img={plantImages[plant._id] || "assets/images/default.png"}
            yieldAmount={plant.totalYield}
          />
        ))}
      </div>
    </div>
  );
}

export default PlantGrowth;
