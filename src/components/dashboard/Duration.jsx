import React, { useState, useEffect } from "react";

function Duration() {
  const [selectedMonth, setSelectedMonth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      setSelectedMonth(currentMonth % 4); // Update selected month based on current date
    }, 86400000);

    return () => clearInterval(interval);
  }, []);

  // Calculate the date based on the selected month
  const calculateDate = (months) => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + months);
    return currentDate.toLocaleDateString();
  };

  return (
    <div className="text-center durationProgress shadow">
      <div className="pt-3">
        <h5>4 Months Duration</h5>
      </div>
      <div className="d-flex justify-content-between">
        <div className="fs-6">
          <span>Seeding</span>
          <br />
          <span>5-21-2024</span>
        </div>
        <input
          type="range"
          className="form-range w-75 mt-3"
          min="0"
          max="3"
          id="customRange2"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        />
        <div className="fs-6">
          <span>Harvesting</span>
          <br />
          <span>8-21-2024</span>
        </div>
      </div>
      <div className="">
        <p>Current Month: {calculateDate(selectedMonth)}</p>
      </div>
    </div>
  );
}

export default Duration;
