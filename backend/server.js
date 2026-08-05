const express = require("express");

const app = express();

const PORT = 5000;

app.use(express.json());

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
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
