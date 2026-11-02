import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET || "somaiyapod_dev_secret", { expiresIn: "7d" });

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "Username or Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token: signToken(user),
      user: publicUser(user),
    });
  } catch {
    return res.status(500).json({ success: false, message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Enter username and password" });
    }

    const user = await User.findOne({ $or: [{ username }, { email: username.toLowerCase() }] });
    const valid = user && (await bcrypt.compare(password, user.password));

    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    return res.json({
      success: true,
      message: "Login successful!",
      token: signToken(user),
      user: publicUser(user),
    });
  } catch {
    return res.status(500).json({ success: false, message: "Error logging in" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const { id } = jwt.verify(token, process.env.JWT_SECRET || "somaiyapod_dev_secret");

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

export default router;
