import mongoose from "mongoose";
import { OrderStatus } from "../constants/orderStatus.js";

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String
}, { _id: false });

const OrderItemSchema = new mongoose.Schema({
  product_name: { type: String },
  hcpcs_code:   { type: String, uppercase: true, trim: true },
  quantity:     { type: Number, min: 1 },
  notes:        { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  dme_id: { type: mongoose.Schema.Types.ObjectId, ref: "DME" },
  order_id: { type: String },

  general_information: {
    patient_id: String,
    patient_mrn: String,
    practice_id: String,
    patient_name: String,
    practice_name: String,
    provider_name: String,
    practice_email: String,
    practice_phone: String,
    supplier_logo_url: String,
    practice_address: AddressSchema
  },

  patient_details: {
    date_of_birth: Date,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phone_number: String,
    address: AddressSchema
    // Removed primary_insurance and secondary_insurance
  },

  order_meta: {
    requested_date: { type: Date, default: Date.now },
    // Removed priority and diagnosis_codes validation
    notes: String
  },

  items: {
    type: [OrderItemSchema],
    validate: v => Array.isArray(v) && v.length > 0
  },

  status: {
    code: { type: Number, default: OrderStatus.INTAKE_SUCCESSFUL.code },
    message: { type: String, default: OrderStatus.INTAKE_SUCCESSFUL.message }
  }

}, { timestamps: true });

OrderSchema.index({ "general_information.patient_id": 1, createdAt: -1 });
OrderSchema.index({ "items.hcpcs_code": 1 });

export default mongoose.model("Order", OrderSchema);
