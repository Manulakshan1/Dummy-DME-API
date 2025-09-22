import express from "express";
import Order from "../models/order.js";
import { authRequired } from "../middleware/auth.js";
import { orderSchema } from "../validate.js";
import { STATUS_MAPPING, DEFAULT_STATUS } from "../constants/orderStatus.js";


const router = express.Router();

/**
 * POST /api/orders
 * Accepts and persists a DME order
 */
router.post("/", authRequired, async (req, res) => {
  try {
    // 1) Validate incoming payload
    const { value, error } = orderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details.map(d => ({ path: d.path.join("."), message: d.message }))
      });
    }

    // 2) Normalize (e.g., uppercase HCPCS codes already handled by Joi uppercase + Mongoose uppercase)

    // 3) Insert into DB
    const order = await Order.create(value);

    // 4) Return created resource
    return res.status(201).json({
      message: "Order received",
      order_id: order._id,
      status: order.status
    });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /api/orders/:id
 * Fetch a single order by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Not found" });
    return res.json(order);
  } catch (err) {
    console.error("Read order error:", err);
    return res.status(400).json({ message: "Invalid id" });
  }
});

// GET /api/orders/:id/status
router.get("/:id/status", authRequired, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const mappedStatus = STATUS_MAPPING[order.status] || DEFAULT_STATUS;

    return res.json({
      order_id: order._id,
      status: order.status,        // original status string
      mappedStatus                 // standardized code + message
    });

  } catch (err) {
    console.error("Order status error:", err);
    return res.status(400).json({ message: "Invalid id" });
  }
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", authRequired, async (req, res) => {
  try {
    const { status } = req.body;

    // Allowed statuses
    const validStatuses = ["received", "validated", "routed", "submitted", "fulfilled", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      message: "Order status updated",
      order_id: order._id,
      new_status: order.status
    });
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


export default router;
