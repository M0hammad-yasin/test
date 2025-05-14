import React from "react";
import { useSensorValues } from "../../context/SensorContext";
function Factor({ sensorType, name, img }) {
  const { sensorValues } = useSensorValues();

  const units = {
    Humidity: "%",
    EC: "MV",
    pH: "",
    CO2: "M",
  };

  return (
    <div className="">
      <img src={img} alt={name} className="img-fluid" />
      <h6 className="text-secondary">{name}</h6>
      <p>
        {sensorValues[sensorType] !== null
          ? `${sensorValues[sensorType]} ${units[sensorType]}`
          : "....."}
      </p>
    </div>
  );
}

function EnvFactors() {
  return (
    <div className="text-center shadow factors py-5">
      <div className="d-flex py-2 justify-content-around">
        <Factor
          sensorType="Humidity"
          name="Humidity"
          img="assets/icons/humidity.png"
        />
        <Factor sensorType="EC" name="EC" img="assets/icons/ec.png" />
      </div>
      <div className="d-flex py-2 justify-content-around">
        <Factor sensorType="pH" name="PH" img="assets/icons/ph.png" />
        <Factor sensorType="CO2" name="CO2" img="assets/icons/co.png" />
      </div>
    </div>
  );
}

export default EnvFactors;
