import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { signAuthToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, name } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existing = await User.findOne({ username: username.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username: username.toLowerCase().trim(), passwordHash, name });

    const token = signAuthToken(user);
    return res.status(201).json({
      message: "User registered",
      token,
      user: { id: user._id, username: user.username, name: user.name }
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signAuthToken(user);
    return res.json({
      message: "Logged in",
      token,
      user: { id: user._id, username: user.username, name: user.name }
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;


