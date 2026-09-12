const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Issue = require("./models/Issue");
const Department = require("./models/Department");
const User = require("./models/User");
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
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: "user",
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);

    res.status(500).json({
      message: "Failed to register user.",
      error: error.message,
    });
  }
});
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);

    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
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
app.post("/api/departments", async (req, res) => {
  try {
    const department = new Department(req.body);

    const savedDepartment = await department.save();

    res.status(201).json({
      message: "Department created successfully!",
      department: savedDepartment,
    });

  } catch (error) {
    console.error("Error creating department:", error);

    res.status(500).json({
      message: "Failed to create department.",
      error: error.message,
    });
  }
});
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await Department.find();

    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);

    res.status(500).json({
      message: "Failed to fetch departments.",
      error: error.message,
    });
  }
});
app.put("/api/issues/:id/department", async (req, res) => {
  try {
    const { department } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { department: department },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({
        message: "Complaint not found."
      });
    }

    res.status(200).json({
      message: "Department assigned successfully!",
      issue: issue
    });
  } catch (error) {
    console.error("Error assigning department:", error);

    res.status(500).json({
      message: "Failed to assign department.",
      error: error.message
    });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
