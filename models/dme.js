import mongoose from "mongoose";

const dmeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact_email: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DME", dmeSchema);
