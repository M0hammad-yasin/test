import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create sensor context
const SensorContext = createContext();

// Custom hook for accessing sensor values
export const useSensorValues = () => useContext(SensorContext);

// Provider component with WebSocket and HTTP fallback
export function SensorProvider({ children }) {
  // Initialize all sensor values with null
  const [sensorValues, setSensorValues] = useState({
    temperature: null,
    Humidity: null,
    EC: null,
    pH: null,
    CO2: null,
  });

  // Track WebSocket connection state
  const [isWsConnected, setIsWsConnected] = useState(false);

  useEffect(() => {
    // HTTP fallback data fetcher
    const fetchSensorValues = async () => {
      try {
        // Fetch all sensor data in parallel
        const [tempRes, humidityRes, ecRes, phRes, co2Res] = await Promise.all([
          axios.get("/sensor-data/temperature/latest"),
          axios.get("/sensor-data/Humidity/latest"),
          axios.get("/sensor-data/EC/latest"),
          axios.get("/sensor-data/pH/latest"),
          axios.get("/sensor-data/CO2/latest"),
        ]);

        // console.log("Values updated from HTTP fallback");

        // Update state with validated numbers
        setSensorValues((prev) => ({
          ...prev,
          temperature: Number(tempRes.data?.temperature) || prev.temperature,
          Humidity: Number(humidityRes.data?.Humidity) || prev.Humidity,
          EC: Number(ecRes.data?.EC) || prev.EC,
          pH: Number(phRes.data?.pH) || prev.pH,
          CO2: Number(co2Res.data?.CO2) || prev.CO2,
        }));
      } catch (error) {
        console.error("Error fetching sensor values:", error);
      }
    };

    // WebSocket configuration
    const ws = new WebSocket("ws://localhost:3001");
    let fallbackInterval;

    // WebSocket event handlers
    ws.onopen = () => {
      // console.log("WebSocket connection established");
      setIsWsConnected(true);
      // Clear any existing fallback interval
      if (fallbackInterval) clearInterval(fallbackInterval);
    };

    ws.onmessage = (event) => {
      try {
        // console.log("Received WebSocket message:", event.data);
        const message = JSON.parse(event.data);

        if (message.type === "SENSOR_DATA" && message.data) {
          // Validate and parse WebSocket data
          const receivedData = {
            temperature: Number(message.data.temperature) || null,
            Humidity: Number(message.data.Humidity) || null,
            EC: Number(message.data.EC) || null,
            pH: Number(message.data.pH) || null,
            CO2: Number(message.data.CO2) || null,
          };

          // Update state with parsed values
          setSensorValues((prev) => ({
            ...prev,
            ...receivedData,
          }));
        }
      } catch (error) {
        console.error("WebSocket message processing error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (!isWsConnected) {
        // Start fallback only if not already connected
        fallbackInterval = setInterval(fetchSensorValues, 3000);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsWsConnected(false);
      // Activate fallback mechanism
      if (!fallbackInterval) {
        fallbackInterval = setInterval(fetchSensorValues, 3000);
      }
    };

    // Initial data fetch
    fetchSensorValues();

    // Cleanup function
    return () => {
      ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []); // Empty dependency array ensures single setup

  return (
    <SensorContext.Provider value={{ sensorValues }}>
      {children}
    </SensorContext.Provider>
  );
}
