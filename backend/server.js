const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Issue = require("./models/Issue");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });



app.get("/", (req, res) => {
  res.send("Smart Civic Issue Reporting System Backend is running!");
});
app.post("/api/issues", async (req, res) => {
  try {
    const issue = new Issue(req.body);

    const savedIssue = await issue.save();

    console.log("New civic issue saved:");
    console.log(savedIssue);

    res.status(201).json({
      message: "Civic issue saved successfully!",
      issue: savedIssue
    });
  } catch (error) {
    console.error("Error saving issue:", error);

    res.status(500).json({
      message: "Failed to save civic issue.",
      error: error.message
    });
  }
});

app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);

    res.status(500).json({
      message: "Failed to fetch issues.",
      error: error.message
    });
  }
});
app.put("/api/issues/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({
        message: "Complaint not found."
      });
    }

    res.status(200).json({
      message: "Complaint status updated successfully!",
      issue: issue
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);

    res.status(500).json({
      message: "Failed to update complaint status.",
      error: error.message
    });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
