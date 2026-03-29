const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); 
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const dashboardRoute = require("./routes/dashboardRoute");

dotenv.config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Database Connect
connectDB();

// Routes
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);
app.use("/api/dashboard", dashboardRoute);

// Default Route
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API chal raha hai!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server port ${PORT} par chal raha hai`);
});