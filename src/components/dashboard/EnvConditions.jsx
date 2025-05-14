import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSensorValues } from "../../context/SensorContext";

function EnvConditions() {
  // const [temperature, setTemperature] = useState(null);
  const { sensorValues } = useSensorValues();
  const temperature = sensorValues.temperature ?? null;
  const displayTemperature = temperature;
  // useEffect(() => {
  //   if (sensorValues.temperature !== null) {
  //     setTemperature((pre) => sensorValues.temperature);
  //   }
  // }, [sensorValues.temperature]);

  return (
    <div className="text-center shadow envConditions ">
      <div className="pt-4">
        <h5>Environment Conditions</h5>
      </div>
      <div style={{ position: "relative" }}>
        <img
          src="assets/images/Conditions.png"
          width={230}
          height={230}
          className="my-5 img-fluid"
          alt="envConditions"
        />
        <h1
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: 0,
          }}
        >
          {displayTemperature !== null ? `${displayTemperature}°C` : "....."}
        </h1>
      </div>
    </div>
  );
}

export default EnvConditions;
