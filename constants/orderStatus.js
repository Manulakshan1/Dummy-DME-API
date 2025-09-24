// constants/orderStatus.js

export const OrderStatus = {
  INTAKE_SUCCESSFUL: { code: 1000, message: "Intake Successful" },
  INTAKE_FAILED: { code: 1010, message: "Intake Failed" },
  DME_FOUND: { code: 1020, message: "DME Found" },
  DME_NOT_FOUND: { code: 1030, message: "DME Not Found" },
  ORDER_ACCEPTED_BY_DME: { code: 1040, message: "Order Accepted By DME" },
  ORDER_REJECTED_BY_DME: { code: 1050, message: "Order Rejected By DME" },
  ORDER_TRANSMISSION_TO_DME_ERROR: { code: 1060, message: "Order Transmission to DME Failed" },
  DME_PARTNER_NOT_RESPONDING: { code: 1070, message: "DME Not Responding" },
  ORDER_PREPARING: { code: 1080, message: "Order Preparing" },
  ORDER_SHIPPED: { code: 1090, message: "Order Shipped" },
  ORDER_DELIVERED: { code: 1100, message: "Order Delivered" },
  NOT_AVAILABLE: { code: 1110, message: "Not Available" },
  ORDER_FLOW_ERROR: { code: 1120, message: "Order Flow Error" }
};

// Default fallback
export const DEFAULT_STATUS = OrderStatus.NOT_AVAILABLE;
