import mongoose from "mongoose";
import { OrderStatus } from "../constants/orderStatus.js";
const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String
}, { _id: false });

const InsuranceSchema = new mongoose.Schema({
  payor: String,                // e.g., "Cigna"
  plan: String,                 // e.g., "Open Access Plus"
  memberId: String,
  groupNumber: String,
  type: { type: String }        // Commercial | Medicaid | Medicare | etc.
}, { _id: false });

const OrderItemSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  hcpcs_code:   { type: String, required: true, uppercase: true, trim: true },
  quantity:     { type: Number, required: true, min: 1 },
  notes:        { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  dme_id: { type: mongoose.Schema.Types.ObjectId, ref: "DME", required: true },

  general_information: {
    patient_id: { type: String, required: true },
    patient_mrn: String,
    practice_id: { type: String, required: true },
    patient_name: { type: String, required: true },
    practice_name: String,
    provider_name: String,
    practice_email: String,
    practice_phone: String,
    supplier_logo_url: String,
    practice_address: AddressSchema
  },
  patient_details: {
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone_number: String,
    address: AddressSchema,
    primary_insurance: InsuranceSchema,
    secondary_insurance: InsuranceSchema
  },
  order_meta: {
    requested_date: { type: Date, default: Date.now },
    priority: { type: String, enum: ["routine", "urgent"], default: "routine" },
    diagnosis_codes: [String], // ICD-10 (optional)
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
