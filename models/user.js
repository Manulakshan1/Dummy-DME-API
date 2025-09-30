import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: false, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: false },
  name: { type: String }
}, { timestamps: true });

UserSchema.index({ username: 1 }, { unique: true });

export default mongoose.model("User", UserSchema);


