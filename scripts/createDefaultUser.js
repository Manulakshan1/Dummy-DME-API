import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

async function createDefaultUser() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dme_orders";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if default user already exists
    const existingUser = await User.findOne({ username: "user" });
    if (existingUser) {
      console.log("ℹ️  Default user already exists");
      process.exit(0);
    }

    // Create default user
    const passwordHash = await bcrypt.hash("password", 10);
    const user = await User.create({
      username: "user",
      passwordHash,
      name: "Default User"
    });

    console.log("✅ Default user created successfully");
    console.log("Username: user");
    console.log("Password: password");
    console.log("User ID:", user._id);

  } catch (error) {
    console.error("❌ Error creating default user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createDefaultUser();
