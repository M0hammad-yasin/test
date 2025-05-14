#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// Wi-Fi credentials
#define DHTPIN D4      // DHT data pin connected to NodeMCU D4
#define DHTTYPE DHT11  // DHT 11
#define RELAY_PIN D1   // GPIO pin connected to the relay module

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "aero";
const char* password = "12345678";

// WebSocket server details
const char* serverIP = "192.168.137.1";  // server's IP
const int serverPort = 3001;

// Create WebSocket object
WebSocketsClient webSocket;

// Timer to send data every 5 seconds
unsigned long lastSent = 0;  // Store last time data was sent

// Function to generate simulated sensor values with realistic variations
void generateSimulatedValues(float &ec, float &ph, float &co2) {
  // Base values for realistic hydroponic/aquaponic system
  static float baseEC = 1.8;    // mS/cm (nutrient solution)
  static float basePH = 6.2;    // pH level
  static float baseCO2 = 800;   // ppm (indoor air)
  
  // Generate small random variations (±10% of base value)
  ec = baseEC + (random(-100, 100) * 0.0018);
  ph = basePH + (random(-100, 100) * 0.0062);
  co2 = baseCO2 + random(-50, 50);

  // Maintain realistic value ranges
  ec = constrain(ec, 0.5, 3.0);    // Typical EC range for hydroponics
  ph = constrain(ph, 5.5, 7.0);     // Acceptable pH range for most plants
  co2 = constrain(co2, 300, 2000);  // CO2 range for indoor environments
  
  // Gradually drift base values over time
  static unsigned long lastDrift = 0;
  if(millis() - lastDrift > 600000) { // Change base every 10 minutes
    baseEC += random(-50, 50) * 0.01;
    basePH += random(-50, 50) * 0.01;
    baseCO2 += random(-100, 100);
    lastDrift = millis();
  }
}

// Function to connect to Wi-Fi
void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// Function to connect to WebSocket server
void connectToWebSocket() {
  Serial.print("Connecting to WebSocket server at ");
  Serial.print(serverIP);
  Serial.print(":");
  Serial.println(serverPort);
  
  webSocket.begin(serverIP, serverPort, "/");
  webSocket.onEvent(webSocketEvent);  // Register the WebSocket event handler
}

// Function to send sensor data to the server
void sendSensorData() {
  // Read actual sensor values
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Generate simulated sensor values
  float ecValue, phValue, co2Value;
  generateSimulatedValues(ecValue, phValue, co2Value);

  // Check if DHT readings failed
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println(F("Failed to read from DHT sensor!"));

    // Create error JSON message
    StaticJsonDocument<1024> errorDoc;
    errorDoc["deviceId"] = "ESP8266_01";
    errorDoc["error"] = "Failed to read from DHT sensor!";

    // Serialize and send error message
    String errorData;
    serializeJson(errorDoc, errorData);
    webSocket.sendTXT(errorData);
    Serial.println("Sent error to server: " + errorData);
    return;
  }

  // Create JSON object with all sensor values
  StaticJsonDocument<1024> jsonDoc;
  jsonDoc["deviceId"] = "ESP8266_01";
  jsonDoc["temperature"] = temperature;
  jsonDoc["humidity"] = humidity;
  jsonDoc["EC"] = ecValue;    // Add simulated EC value
  jsonDoc["pH"] = phValue;    // Add simulated pH value
  jsonDoc["CO2"] = co2Value;  // Add simulated CO2 value

  // Serialize JSON data to string
  String jsonData;
  serializeJson(jsonDoc, jsonData);

  // Send data through WebSocket connection
  webSocket.sendTXT(jsonData);
  Serial.println("Sent data to server: " + jsonData);
}

// Rest of the code remains unchanged...
// [Existing webSocketEvent, setup, and loop functions below]



#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// Wi-Fi credentials
#define DHTPIN D4      // DHT data pin connected to NodeMCU D4
#define DHTTYPE DHT11  // DHT 11

#define RELAY_PIN D1   // GPIO pin connected to the relay module

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "aero";
const char* password = "12345678";

// WebSocket server details
const char* serverIP = "192.168.137.1";  //  server's IP
const int serverPort = 3001;

// Create WebSocket object
WebSocketsClient webSocket;
unsigned long lastSent = 0;  // Store last time data was sent

// Function to generate simulated sensor values with realistic variations
void generateSimulatedValues(float &ec, float &ph, float &co2) {
  // Base values for realistic hydroponic/aquaponic system
  static float baseEC = 1.8;    // mS/cm (nutrient solution)
  static float basePH = 6.2;    // pH level
  static float baseCO2 = 800;   // ppm (indoor air)
  
  // Generate small random variations (±10% of base value)
  ec = baseEC + (random(-100, 100) * 0.0018);
  ph = basePH + (random(-100, 100) * 0.0062);
  co2 = baseCO2 + random(-50, 50);

  // Maintain realistic value ranges
  ec = constrain(ec, 0.5, 3.0);    // Typical EC range for hydroponics
  ph = constrain(ph, 5.5, 7.0);     // Acceptable pH range for most plants
  co2 = constrain(co2, 300, 2000);  // CO2 range for indoor environments
  
  // Gradually drift base values over time
  static unsigned long lastDrift = 0;
  if(millis() - lastDrift > 600000) { // Change base every 10 minutes
    baseEC += random(-50, 50) * 0.01;
    basePH += random(-50, 50) * 0.01;
    baseCO2 += random(-100, 100);
    lastDrift = millis();
  }
}

// Function to connect to Wi-Fi
void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// Function to connect to WebSocket server
void connectToWebSocket() {
  Serial.print("Connecting to WebSocket server at ");
  Serial.print(serverIP);
  Serial.print(":");
  Serial.println(serverPort);
  
  webSocket.begin(serverIP, serverPort, "/");
  webSocket.onEvent(webSocketEvent);  // Register the WebSocket event handler
}

// Function to send sensor data to the server
void sendSensorData() {
  // Read actual sensor values
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Generate simulated sensor values
  float ecValue, phValue, co2Value;
  generateSimulatedValues(ecValue, phValue, co2Value);

  // Check if DHT readings failed
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println(F("Failed to read from DHT sensor!"));

    // Create error JSON message
    StaticJsonDocument<1024> errorDoc;
    errorDoc["deviceId"] = "ESP8266_01";
    errorDoc["error"] = "Failed to read from DHT sensor!";

    // Serialize and send error message
    String errorData;
    serializeJson(errorDoc, errorData);
    webSocket.sendTXT(errorData);
    Serial.println("Sent error to server: " + errorData);
    return;
  }

  // Create JSON object with all sensor values
  StaticJsonDocument<1024> jsonDoc;
  jsonDoc["deviceId"] = "ESP8266_01";
  jsonDoc["temperature"] = temperature;
  jsonDoc["humidity"] = humidity;
  jsonDoc["EC"] = ecValue;    // Add simulated EC value
  jsonDoc["pH"] = phValue;    // Add simulated pH value
  jsonDoc["CO2"] = co2Value;  // Add simulated CO2 value

  // Serialize the JSON object to a string
  String jsonData;
  serializeJson(jsonDoc, jsonData);

  // Send the data to the server
  webSocket.sendTXT(jsonData);
  Serial.println("Sent data to server: " + jsonData);
}

// Function to handle WebSocket events
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.println("Connected to WebSocket server");
      break;

    case WStype_DISCONNECTED:
      Serial.println("Disconnected from WebSocket server");
      break;

    case WStype_TEXT: {
      Serial.print("Received message: ");
      Serial.println((char*)payload);

      // Parse the JSON message
      StaticJsonDocument<1024> jsonDoc;
      DeserializationError error = deserializeJson(jsonDoc, payload);

      if (!error) {
        // Check for LED control command
        if (jsonDoc.containsKey("type") && jsonDoc["type"] == "LED_STATUS") {
          bool ledStatus = jsonDoc["status"];
          digitalWrite(RELAY_PIN, ledStatus ? LOW : HIGH);
          Serial.println(ledStatus ? "LED turned ON" : "LED turned OFF");
        }
      } else {
        Serial.println("Failed to parse WebSocket message");
      }
      break;
    }

    case WStype_ERROR:
      Serial.println("Error in WebSocket connection");
      break;

    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  connectToWiFi();  // Connect to Wi-Fi
  dht.begin(); // Start DHT sensor
  connectToWebSocket();  // Connect to WebSocket server

  // Initialize the relay pin
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Start with the relay off
}

void loop() {
  // Maintain WebSocket connection
  webSocket.loop();

  // Send data every 5 seconds
  if (millis() - lastSent >= 5000) {  // Check if 5 seconds have passed
    sendSensorData();  // Send the sensor data
    lastSent = millis();  // Update lastSent to current time
  }
}
