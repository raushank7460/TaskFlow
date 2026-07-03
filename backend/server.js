
const dotenv = require("dotenv");
const express = require("express");
// const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const dashboardRoute = require("./routes/dashboardRoute");

 dotenv.config();

const app = express();

// Database Connect
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);
app.use("/api/dashboard", dashboardRoute);

// Health Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API chal raha hai!",
  });
});

// Frontend Serve
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// React routes handle karne ke liye
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server port ${PORT} par chal raha hai`);
// });
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}

module.exports = app;