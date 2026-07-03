const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://raushanyadav8130_db_user:M2EYa1Zc7bOUw6hJ@cluster0.fsc9vjd.mongodb.net/");

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;