
export const STATUS_MAPPING = {
  received:   { 1040: "Order Accepted By DME" },
  cancelled:  { 1050: "Order Rejected By DME" },
  routed:     { 1060: "Order Transmission to DME Failed" },
  submitted:  { 1070: "DME Not Responding" },
  validated:  { 1080: "Order Preparing" },
  fulfilled:  { 1090: "Order Shipped" }
};

export const DEFAULT_STATUS = { 1110: "Not Available" };
