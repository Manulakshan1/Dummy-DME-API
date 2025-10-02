import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { signAuthToken, signRefreshToken, verifyRefreshToken } from "../middleware/auth.js";

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
    const refreshToken = signRefreshToken(user);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      message: "User registered",
      token,
      refreshToken,
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
    const refreshToken = signRefreshToken(user);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      message: "Logged in",
      token,
      refreshToken,
      user: { id: user._id, username: user.username, name: user.name }
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/token/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify the refresh token
    const payload = verifyRefreshToken(refreshToken);
    
    // Find the user and verify the refresh token matches
    const user = await User.findById(payload.sub);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const newAccessToken = signAuthToken(user);
    const newRefreshToken = signRefreshToken(user);

    // Update the refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    return res.json({
      message: "Token refreshed successfully",
      token: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user._id, username: user.username, name: user.name }
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

export default router;


;