import express from "express";
import DME from "../models/dme.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// Create DME
router.post("/", authRequired, async (req, res) => {
  try {
    const dme = await DME.create({
      ...req.body,
      created_by: req.user.userId
    });
    res.status(201).json(dme);
  } catch (err) {
    console.error("Error creating DME:", err);
    res.status(500).json({ message: "Error creating DME" });
  }
});

// List all DMEs (for testing, no restriction)
router.get("/", authRequired, async (req, res) => {
  try {
    const dmes = await DME.find().lean();
    res.json(dmes);
  } catch (err) {
    console.error("Error fetching DMEs:", err);
    res.status(500).json({ message: "Error fetching DMEs" });
  }
});

// List only DMEs created by this user
router.get("/my", authRequired, async (req, res) => {
  try {
    const dmes = await DME.find({ created_by: req.user.userId }).lean();
    res.json(dmes);
  } catch (err) {
    console.error("Error fetching user DMEs:", err);
    res.status(500).json({ message: "Error fetching DMEs" });
  }
});

export default router;
