const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { handleWebsocket } = require("./helpers/webSocket");
const { connectToDatabase, Blog } = require("./mongoose");
const initializeLED = require("./helpers/ledInitialize");
// Random data generators
const {
  generateAndPostSensorData,
} = require("../Backend/RandomData/sensorFactors");
const {
  generateAndPostWeeklyYieldData,
} = require("../Backend/RandomData/yieldFactors");

// Configure dotenv
dotenv.config();

// Create Express App
const app = express();

// Enable CORS
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Static folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/dataRoutes"));
app.use("/", require("./routes/plantYieldRoutes"));

// HTTP Routes for Blogs
app.get("/blogs", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.json(allBlogs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/blogs/new", async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    const newBlog = new Blog({ title, content, image: { url: imageUrl } });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/blogs/show/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/blogs/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Database Connection
async function main() {
  await connectToDatabase();
}
main().catch((err) => console.log(err));

// Create HTTP Server
const server = http.createServer(app);
initializeLED();
// WebSocket Handling
const { sendLEDStatus } = handleWebsocket(server);

const { LED } = require("./mongoose");

// Update LED status
app.post("/led/status", async (req, res) => {
  const { status } = req.body;

  try {
    // Update LED status in database
    const updatedLED = await LED.findOneAndUpdate(
      {},
      { status, updatedAt: new Date() },
      { new: true, upsert: true } // Added upsert option
    );

    try {
      // Send status to ESP8266
      await sendLEDStatus(status);
      res.status(200).json({
        message: "LED status updated successfully",
        updatedLED,
      });
    } catch (wsError) {
      // If WebSocket fails, revert the database change
      await LED.findOneAndUpdate(
        { _id: updatedLED._id },
        { status: !status, updatedAt: new Date() },
        { new: true }
      );

      throw wsError; // Re-throw to be caught by outer catch block
    }
  } catch (err) {
    console.error("Error updating LED status:", err);
    res.status(503).json({
      error: "Failed to update LED status",
      message: err.message,
      details: "Please ensure the ESP8266 device is connected",
    });
  }
});

// Start Random Data Generation
generateAndPostSensorData();
generateAndPostWeeklyYieldData();

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
