import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const seedDemoUser = async () => {
  if (await User.exists({ username: "somaiya_admin" })) return;
  await User.create({
    username: "somaiya_admin",
    email: "admin@somaiya.edu",
    password: await bcrypt.hash("password123", 10),
  });
  console.log("Demo operator created: somaiya_admin");
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/somaiyapod");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDemoUser();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;
