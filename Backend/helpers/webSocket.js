const WebSocket = require("ws");
const {
  CO2Data,
  pHData,
  HumidityData,
  ECData,
  temperatureData,
} = require("../mongoose");

const handleWebsocket = (server) => {
  const wss = new WebSocket.Server({ server });
  let esp8266Client = null;

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection attempted");

    // Send an initial message requesting device identification
    ws.send(JSON.stringify({ type: "IDENTIFY" }));

    ws.on("message", (message) => {
      const dataString = message.toString();
      console.log("Received from client:", dataString);

      try {
        const parsedData = JSON.parse(dataString);

        // Identify  deviceId
        if (parsedData.deviceId === "ESP8266_01") {
          esp8266Client = ws;
          console.log("ESP8266 identified and connected");
        }

        // Handle temperature and humidity data
        // if (parsedData.temperature && parsedData.humidity) {
        //   const newtemperatureData = new temperatureData({
        //     value: parsedData.temperature,
        //   });
        //   const newhumidityData = new HumidityData({
        //     value: parsedData.humidity,
        //   });

        //   Promise.all([newtemperatureData.save(), newhumidityData.save()])
        //     .then(() => {
        //       console.log("Temperature and humidity data saved to database");
        //     })
        //     .catch((err) => {
        //       console.error("Error saving sensor data:", err);
        //     });

        // }
        ///new attempt
        if (
          parsedData.temperature &&
          parsedData.humidity &&
          parsedData.EC &&
          parsedData.pH &&
          parsedData.CO2
        ) {
          const newtemperatureData = new temperatureData({
            value: parsedData.temperature,
          });
          const newhumidityData = new HumidityData({
            value: parsedData.humidity,
          });
          const newECData = new ECData({
            value: parsedData.EC,
          });
          const newpHData = new pHData({
            value: parsedData.pH,
          });
          const newCO2Data = new CO2Data({
            value: parsedData.CO2,
          });
          Promise.all([
            newtemperatureData.save(),
            newhumidityData.save(),
            newECData.save(),
            newpHData.save(),
            newCO2Data.save(),
          ])
            .then(() => {
              console.log("Data saved");

              // Broadcast to all frontend clients
              wss.clients.forEach((client) => {
                if (
                  client !== esp8266Client &&
                  client.readyState === WebSocket.OPEN
                ) {
                  client.send(
                    JSON.stringify({
                      type: "SENSOR_DATA",
                      data: {
                        // Include all sensor values received from NodeMCU
                        temperature: parsedData.temperature,
                        Humidity: parsedData.humidity,
                        EC: parsedData.EC,
                        pH: parsedData.pH,
                        CO2: parsedData.CO2,
                      },
                    })
                  );
                }
              });
            })
            .catch((err) => {
              console.error("Error saving sensor data:", err);
            });
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      if (ws === esp8266Client) {
        esp8266Client = null;
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      if (ws === esp8266Client) {
        esp8266Client = null;
      }
    });
  });

  // Function to send LED status to ESP8266
  const sendLEDStatus = async (status) => {
    return new Promise((resolve, reject) => {
      if (!esp8266Client) {
        reject(new Error("ESP8266 not connected"));
        return;
      }

      if (esp8266Client.readyState !== WebSocket.OPEN) {
        esp8266Client = null;
        reject(new Error("ESP8266 connection is not open"));
        return;
      }

      const message = JSON.stringify({
        type: "LED_STATUS",
        status: status,
      });

      esp8266Client.send(message, (error) => {
        if (error) {
          console.error("Error sending LED status:", error);
          reject(error);
        } else {
          console.log(`LED status sent to ESP8266: ${status ? "ON" : "OFF"}`);
          resolve();
        }
      });
    });
  };

  return { sendLEDStatus };
};

module.exports = { handleWebsocket };
