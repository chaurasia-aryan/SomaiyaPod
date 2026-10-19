import express from "express";
import User from "../models/User.js";

const router = express.Router();

// 1. Register User (Simple & direct)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "Username or Email already exists" });
    }

    // Save directly to MongoDB
    const user = new User({ username, email, password });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token: "user_token_" + user._id,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error registering user" });
  }
});

// 2. Login User (Simple username & password check)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Enter username and password" });
    }

    // Find user with matching username/email and password
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      password: password,
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    return res.json({
      success: true,
      message: "Login successful!",
      token: "user_token_" + user._id,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error logging in" });
  }
});

// 3. Get Current User Profile
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const userId = token.replace("user_token_", "");

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

export default router;
