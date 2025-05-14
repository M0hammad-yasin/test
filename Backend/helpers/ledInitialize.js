const { LED } = require("../mongoose");

const initializeLED = async () => {
  try {
    await LED.findOneAndUpdate(
      {}, // Match any document
      { $setOnInsert: { status: false } }, // Only set this if a new document is inserted
      { upsert: true, new: true } // Create if not exists, return the document
    );
    console.log("LED initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize LED:", error);
  }
};
module.exports = initializeLED;
