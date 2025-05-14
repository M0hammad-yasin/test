const { WeeklyYieldData } = require("../mongoose");

// function to post Weekly Yield Data to MOngoDB

const postWeeklyYieldData = async (req, res) => {
  try {
    const { weekStartDate, weekEndDate, plantYields } = req.body;
    const newWeeklyYieldData = new WeeklyYieldData({
      weekStartDate,
      weekEndDate,
      plantYields,
    });
    await newWeeklyYieldData.save();
    res.status(201).json(newWeeklyYieldData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// function to fetch Total Yield Data

const getTotalYieldData = async (req, res) => {
  try {
    const yieldData = await WeeklyYieldData.aggregate([
      { $unwind: "$plantYields" },
      { $unwind: "$plantYields.yieldValues" },
      {
        $group: {
          _id: "$plantYields.plant",
          totalYield: { $sum: "$plantYields.yieldValues" },
        },
      },
    ]);

    res.status(200).json(yieldData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// function to fetch Weekly Yield Data

const getWeeklyYieldData = async (req, res) => {
  try {
    const weeklyYieldData = await WeeklyYieldData.find({});
    res.status(200).json({ plantYields: weeklyYieldData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { postWeeklyYieldData, getTotalYieldData, getWeeklyYieldData };
