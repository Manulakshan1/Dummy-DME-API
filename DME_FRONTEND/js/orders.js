const API = "http://34.214.183.199:4000/api";
const token = localStorage.getItem("token");

let allOrders = [];
let filteredOrders = [];

// Check authentication
if (!token) {
  window.location.href = "index.html";
  exit;
}

// Event listeners
document.getElementById("createOrderBtn").addEventListener("click", () => {
  window.location.href = "order-create.html";
});

document.getElementById("searchInput").addEventListener("input", filterOrders);
document.getElementById("statusFilter").addEventListener("change", filterOrders);

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

async function loadOrders() {
  try {
    showLoading(true);
    
    const res = await fetch(`${API}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    allOrders = await res.json();
    filteredOrders = [...allOrders];
    
    displayOrders();
    showLoading(false);
    
    if (allOrders.length === 0) {
      showNoOrders(true);
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    showLoading(false);
    alert("Failed to load orders. Please try again.");
  }
}

function displayOrders() {
  const tbody = document.getElementById("orderTableBody");
  tbody.innerHTML = "";

  if (filteredOrders.length === 0) {
    showNoOrders(true);
    return;
  }

  showNoOrders(false);

  filteredOrders.forEach(order => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-order-id", order._id);

    // Create status dropdown
    const statusSelect = createStatusDropdown(order);
    
    // Format created date
    const createdDate = new Date(order.createdAt).toLocaleDateString();
    
    // Get first item details (assuming single item per order for display)
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
    
    tr.innerHTML = `
      <td class="order-id">${order.order_id}...</td>
      <td>${order.general_information?.patient_name || "-"}</td>
      <td>${order.general_information?.practice_name || "-"}</td>
      <td>${firstItem?.hcpcs_code || "-"}</td>
      <td>${firstItem?.product_name || "-"}</td>
      <td>${firstItem?.quantity || "-"}</td>
      <td class="status-cell"></td>
      <td>${createdDate}</td>
    `;
    
    // Add status dropdown to the status cell
    const statusCell = tr.querySelector('.status-cell');
    statusCell.appendChild(statusSelect);
    
    tbody.appendChild(tr);
  });
}

function createStatusDropdown(order) {
  const statusOptions = [
    "ORDER_ACCEPTED_BY_DME",
    "ORDER_REJECTED_BY_DME", 
    "ORDER_TRANSMISSION_TO_DME_ERROR",
    "DME_PARTNER_NOT_RESPONDING",
    "ORDER_PREPARING",
    "ORDER_SHIPPED",
    "ORDER_DELIVERED",
    "NOT_AVAILABLE",
    "ORDER_FLOW_ERROR"
  ];

  const select = document.createElement("select");
  select.className = "status-select";
  
  statusOptions.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = formatStatusText(opt);

    // Check if this is the current status
    const currentStatusKey = order.status?.message
      ?.replace(/\s+/g, "_")
      .toUpperCase();

    if (currentStatusKey === opt) {
      option.selected = true;
    }

    select.appendChild(option);
  });

  // Handle status change
  select.addEventListener("change", async (e) => {
    try {
      const response = await fetch(`${API}/orders/${order._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ statusKey: e.target.value })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the order in our local data
      const orderIndex = allOrders.findIndex(o => o._id === order._id);
      if (orderIndex !== -1) {
        allOrders[orderIndex].status = {
          message: formatStatusText(e.target.value),
          code: getStatusCode(e.target.value)
        };
      }

      // Refresh the display
      filterOrders();
      
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
      // Reset the select to original value
      select.value = order.status?.message?.replace(/\s+/g, "_").toUpperCase() || "";
    }
  });

  return select;
}

function formatStatusText(statusKey) {
  return statusKey
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getStatusCode(statusKey) {
  // This would typically map to actual status codes from your backend
  const statusCodeMap = {
    "ORDER_ACCEPTED_BY_DME": 1,
    "ORDER_REJECTED_BY_DME": 2,
    "ORDER_TRANSMISSION_TO_DME_ERROR": 3,
    "DME_PARTNER_NOT_RESPONDING": 4,
    "ORDER_PREPARING": 5,
    "ORDER_SHIPPED": 6,
    "ORDER_DELIVERED": 7,
    "NOT_AVAILABLE": 8,
    "ORDER_FLOW_ERROR": 9
  };
  return statusCodeMap[statusKey] || 0;
}

function filterOrders() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;

  filteredOrders = allOrders.filter(order => {
    const matchesSearch = !searchTerm || 
      (order.general_information?.patient_name?.toLowerCase().includes(searchTerm)) ||
      (order.general_information?.practice_name?.toLowerCase().includes(searchTerm)) ||
      (order.items?.some(item => item.hcpcs_code?.toLowerCase().includes(searchTerm))) ||
      (order.items?.some(item => item.product_name?.toLowerCase().includes(searchTerm)));

    const matchesStatus = !statusFilter || 
      (order.status?.message?.replace(/\s+/g, "_").toUpperCase() === statusFilter);

    return matchesSearch && matchesStatus;
  });

  displayOrders();
}

function showLoading(show) {
  document.getElementById("loadingMessage").style.display = show ? "block" : "none";
}

function showNoOrders(show) {
  document.getElementById("noOrdersMessage").style.display = show ? "block" : "none";
}

function viewOrderDetails(orderId) {
  // Navigate to order details page or show modal
  window.location.href = `order-details.html?id=${orderId}`;
}

function editOrder(orderId) {
  // Navigate to order edit page
  window.location.href = `order-edit.html?id=${orderId}`;
}

// Initialize the page
loadOrders();