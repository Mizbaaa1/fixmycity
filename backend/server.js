const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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
app.post("/api/issues", (req, res) => {
  const issue = req.body;

  console.log("New civic issue received:");
  console.log(issue);

  res.status(201).json({
    message: "Civic issue received successfully!",
    issue: issue
    
  });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
