import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-ui-kit/css/mdb.min.css";

const LEDToggle = ({ className }) => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    axios
      .get("/led/status")
      .then((response) => {
        setIsOn(response.data.isOn);
      })
      .catch((error) => {
        console.error("Error fetching LED status:", error);
      });
  }, []);
  const handleToggle = () => {
    setIsOn((newStatus) => !newStatus);

    // Send the updated status to the server
    axios
      .post("/led/status", { status: isOn })
      .then((response) => {
        console.log("LED status updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating LED status:", error);
      });
  };

  return (
    <div className={`led-toggle flex flex-col justify-between ${className}`}>
      <button
        className={`btn ${isOn ? "btn-success" : "btn-danger"}`}
        onClick={handleToggle}
      >
        {isOn ? "Turn On" : "Turn Off"}
      </button>
    </div>
  );
};

export default LEDToggle;
