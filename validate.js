import Joi from "joi";
import mongoose from "mongoose";
import { OrderStatus } from "./constants/orderStatus.js";

// Extract valid keys from OrderStatus at the top
const validStatusKeys = Object.keys(OrderStatus);



export const orderSchema = Joi.object({
  general_information: Joi.object({
    patient_id: Joi.string().required(),
    patient_mrn: Joi.string().optional(),
    practice_id: Joi.string().required(),
    patient_name: Joi.string().required(),
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
  }).required(),

  patient_details: Joi.object({
    date_of_birth: Joi.date().iso().required(),
    gender: Joi.string().valid("Male","Female","Other").required(),
    phone_number: Joi.string().optional(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zip: Joi.string()
    }).optional(),
    primary_insurance: Joi.object({
      payor: Joi.string(),
      plan: Joi.string(),
      memberId: Joi.string(),
      groupNumber: Joi.string(),
      type: Joi.string()
    }).optional(),
    secondary_insurance: Joi.object({
      payor: Joi.string(),
      plan: Joi.string(),
      memberId: Joi.string(),
      groupNumber: Joi.string(),
      type: Joi.string()
    }).optional()
  }).required(),

  order_meta: Joi.object({
    requested_date: Joi.date().iso().optional(),
    priority: Joi.string().valid("routine","urgent").optional(),
    diagnosis_codes: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().allow("").optional()
  }).optional(),

  items: Joi.array().items(
    Joi.object({
      product_name: Joi.string().required(),
      hcpcs_code: Joi.string().trim().uppercase().required(),
      quantity: Joi.number().integer().min(1).required(),
      notes: Joi.string().allow("").optional()
    })
  ).min(1).required(),

  status: Joi.string().valid(...validStatusKeys).optional()


});
