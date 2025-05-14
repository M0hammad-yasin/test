const mongoose = require("mongoose");

// BlogSchema

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      default:
        "https://ars.els-cdn.com/content/image/1-s2.0-S2405844024028548-gr2.jpg",
    },
  },
});

const Blog = mongoose.model("Blog", blogSchema);

// UserSchema and connection

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  img: {
    type: String,
    default: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
  },
});

const User = mongoose.model("User", userSchema);

// Schemas for Sensors Data

// Schema for Temperature
const temperatureDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
temperatureDataSchema.index({ timestamp: 1 });

const temperatureData = mongoose.model(
  "temperatureData",
  temperatureDataSchema
);

// Schema for Humidity
const humidityDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
humidityDataSchema.index({ timestamp: 1 });

const HumidityData = mongoose.model("HumidityData", humidityDataSchema);

// Schema for Electrical Conductivity
const ECDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
ECDataSchema.index({ timestamp: 1 });

const ECData = mongoose.model("ECData", ECDataSchema);

// Schema for pH
const pHDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
pHDataSchema.index({ timestamp: 1 });

const pHData = mongoose.model("pHData", pHDataSchema);

// Schema for CO2
const co2DataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
co2DataSchema.index({ timestamp: 1 });

const CO2Data = mongoose.model("CO2Data", co2DataSchema);

// Schema for Solution Level
const solLevelDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
solLevelDataSchema.index({ timestamp: 1 });

const solLevelData = mongoose.model("solLevelData", solLevelDataSchema);

// Schema for weekly plantYield

const plantYieldSchema = new mongoose.Schema({
  plant: String,
  yieldValues: {
    type: [Number],
    default: [],
  },
});

const weeklyYieldSchema = new mongoose.Schema({
  weekStartDate: Date,
  weekEndDate: Date,
  plantYields: [plantYieldSchema],
});

const WeeklyYieldData = mongoose.model("WeeklyYieldData", weeklyYieldSchema);

// schemas for Timer and Sprinkler Run

const statusSchema = new mongoose.Schema({
  timerComplete: {
    type: Number,
    default: 0,
  },
  sprinklerRun: {
    type: Number,
    default: 0,
  },
});

const Status = mongoose.model("Status", statusSchema);
const ledSchema = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      required: true,
      default: false, // Default to 'off'
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set to the current timestamp
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Create the LED model
const LED = mongoose.model("LED", ledSchema);

async function connectToDatabase() {
  await mongoose.connect("mongodb://127.0.0.1:27017/VertiBlockX");
}

module.exports = {
  connectToDatabase,
  mongoose,
  Blog,
  User,
  LED,
  temperatureData,
  HumidityData,
  pHData,
  ECData,
  CO2Data,
  solLevelData,
  WeeklyYieldData,
  Status,
};
