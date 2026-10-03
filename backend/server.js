const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Issue = require("./models/Issue");
const Department = require("./models/Department");
const User = require("./models/User");
require("dotenv").config();
const auth = require("./middleware/auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.post("/api/issues", upload.single("photo"), async (req, res) => {
  try {
    const issue = new Issue({
      ...req.body,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    });

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
app.get("/api/issues", auth, async (req, res) => {
  try {
    let issues;

    if (req.user.role === "department") {
      issues = await Issue.find({
        department: req.user.department,
      }).sort({ createdAt: -1 });
    } else {
      issues = await Issue.find().sort({ createdAt: -1 });
    }

    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({
      message: "Failed to fetch issues.",
      error: error.message,
    });
  }
});
app.put("/api/issues/:id/status", auth, async (req, res) => {
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
app.post("/api/departments", auth, async (req, res) => {
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
app.put("/api/issues/:id/resolved-photo", auth, upload.single("resolvedPhoto"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resolved photo."
      });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        resolvedPhoto: `/uploads/${req.file.filename}`,
      },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({
        message: "Complaint not found."
      });
    }

    res.status(200).json({
      message: "Resolved photo uploaded successfully!",
      issue: issue
    });
  } catch (error) {
    console.error("Error uploading resolved photo:", error);

    res.status(500).json({
      message: "Failed to upload resolved photo.",
      error: error.message
    });
  }
});
app.put("/api/issues/:id/department", auth, async (req, res) => {
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
app.get("/api/location", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required.",
      });
    }

    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status}`);
    }

    const data = await response.json();

    const locationParts = [
      data.locality,
      data.city,
      data.principalSubdivision,
      data.countryName,
    ].filter(Boolean);

    const locationName = [...new Set(locationParts)].join(", ");

    res.json({
      location: locationName || "Location unavailable",
    });
  } catch (error) {
    console.error("Location lookup error:", error);

    res.status(500).json({
      message: "Unable to get location.",
    });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
