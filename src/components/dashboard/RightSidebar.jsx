import React, { useState, useEffect } from "react";
import axios from "axios";

function CountdownTimer({ onTimerComplete }) {
  const initialTime = 4 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimerComplete();
      setTimeLeft(initialTime);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimerComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <p>Initial Time: {`${minutes}:${seconds.toString().padStart(2, "0")}`}</p>
  );
}

function RightSidebar() {
  const [timerComplete, setTimerComplete] = useState(0);
  const [sprinklerRun, setSprinklerRun] = useState(0);
  const [solutionLevel, setSolutionLevel] = useState(null);

  const handleTimerComplete = async () => {
    const newTimerComplete = timerComplete + 1;
    const newSprinklerRun = sprinklerRun + 1;
    setTimerComplete(newTimerComplete);
    setSprinklerRun(newSprinklerRun);
    try {
      await axios.post("http://localhost:3001/status/update", {
        timerComplete: newTimerComplete,
        sprinklerRun: newSprinklerRun,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3001/status/latest");
        setTimerComplete(response.data.timerComplete);
        setSprinklerRun(response.data.sprinklerRun);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    const fetchSolutionLevel = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/sensor-data/solLevel/latest"
        );
        const roundedsolLevel = Math.round(response.data.solLevel);
        setSolutionLevel(roundedsolLevel);
      } catch (error) {
        console.error("Error fetching solution level:", error);
      }
    };

    fetchStatus();
    fetchSolutionLevel();
    const interval = setInterval(fetchSolutionLevel, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-12 col-md-2 col-lg-2 rightSidebar shadow">
      <div className="pt-5 text-center">
        <img src="assets/images/clock.png" alt="clock" className="img-fluid" />
        <p className="pt-3">Timer</p>
      </div>

      <div className="pt-3">
        <div className="countDownTimer">
          <CountdownTimer onTimerComplete={handleTimerComplete} />
        </div>

        <div className="timerCompletes pt-3">
          <p>
            Timer Complete :{" "}
            <span className="time-notification">{timerComplete}</span>
          </p>
        </div>
      </div>

      <div className="sprinkler pt-5">
        <div className="text-center">
          <img
            src="assets/images/sprinkler.png"
            alt="sprinkler"
            className="img-fluid"
          />
        </div>

        <div className="sprinkler-run pt-3">
          <p>
            Sprinkler Run :{" "}
            <span className="time-notification">{sprinklerRun}</span>
          </p>
        </div>
      </div>

      <div className="solution pt-3">
        <div className="text-center">
          <img
            src="assets/images/solution.png"
            alt="solution"
            className="img-fluid"
          />
        </div>

        <div className="sprinkler-run pt-3">
          <p>
            Solution Level:{" "}
            <span className="time-notification">
              {solutionLevel !== null ? `${solutionLevel} ml` : "....."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
