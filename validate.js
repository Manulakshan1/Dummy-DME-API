import Joi from "joi";
import mongoose from "mongoose";
import { OrderStatus } from "./constants/orderStatus.js";

// Extract valid keys from OrderStatus at the top
const validStatusKeys = Object.keys(OrderStatus);



export const orderSchema = Joi.object({
  general_information: Joi.object({
    patient_id: Joi.string().optional(),
    patient_mrn: Joi.string().optional(),
    practice_id: Joi.string().optional(),
    patient_name: Joi.string().optional(),
    practice_name: Joi.string().optional(),
    provider_name: Joi.string().optional(),
    practice_email: Joi.string().email().optional(),
    practice_phone: Joi.string().optional(),
    supplier_logo_url: Joi.string().uri().optional(),
    practice_address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zip: Joi.string()
    }).optional()
  }).optional(),

  patient_details: Joi.object({
    date_of_birth: Joi.string().optional(), // Changed from date().iso() to string to accept "1962-11-03"
    gender: Joi.string().valid("Male","Female","Other").optional(),
    phone_number: Joi.string().optional(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zip: Joi.string()
    }).optional(),
    primary_insurance: Joi.object({
      payor: Joi.string().allow(""), // Allow empty strings
      plan: Joi.string().allow(""),
      memberId: Joi.string().allow(""),
      groupNumber: Joi.string().allow(""),
      type: Joi.string()
    }).optional(),
    secondary_insurance: Joi.object({
      payor: Joi.string().allow(""), // Allow empty strings
      plan: Joi.string().allow(""),
      memberId: Joi.string().allow(""),
      groupNumber: Joi.string().allow(""),
      type: Joi.string()
    }).optional()
  }).optional(),

  order_meta: Joi.object({
    requested_date: Joi.string().optional(), // Changed from date().iso() to string to accept "2025-09-30"
    priority: Joi.string().optional(), // Removed enum restriction to allow "Normal"
    diagnosis_codes: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().allow("").optional()
  }).optional(),

  items: Joi.array().items(
    Joi.object({
      product_name: Joi.string().optional(),
      hcpcs_code: Joi.string().trim().uppercase().optional(),
      quantity: Joi.number().integer().min(1).optional(),
      notes: Joi.string().allow("").optional()
    })
  ).optional(), // Removed .min(1) requirement

  status: Joi.string().optional() // Removed enum restriction to allow "received"

}).unknown(true); // Allow any additional fields
