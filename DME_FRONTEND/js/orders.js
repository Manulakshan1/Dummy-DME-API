const API = "http://localhost:4000/api";
const token = localStorage.getItem("token");

// Parse URL params
const urlParams = new URLSearchParams(window.location.search);
const dmeId = urlParams.get("dmeId");   // still needed for API call
const slug = urlParams.get("slug");     // new: human-friendly DME name

// Update page header with slug (pretty name)
if (slug) {
  const header = document.querySelector("h1");
  if (header) {
    header.textContent = `${slug.replace(/-/g, " ")} - Orders`;
  }
}

// Handle create order button
document.getElementById("createOrderBtn").addEventListener("click", () => {
  // Preserve both ID + slug when creating an order
  window.location.href = `order-create.html?dmeId=${dmeId}&slug=${slug}`;
});

async function loadOrders() {
  const res = await fetch(`${API}/orders/dme/${dmeId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const orders = await res.json();

  const tbody = document.getElementById("orderTableBody");
  tbody.innerHTML = "";

  orders.forEach(order => {
    const tr = document.createElement("tr");

    const statusOptions = [
      "INTAKE_SUCCESSFUL",
      "INTAKE_FAILED",
      "DME_FOUND",
      "DME_NOT_FOUND",
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

    // Dropdown for status
    const select = document.createElement("select");
    statusOptions.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;

      const currentStatusKey = order.status?.replace(/\s+/g, "_").toUpperCase();
      if (currentStatusKey === opt) {
        option.selected = true;
      }

      select.appendChild(option);
    });

    // Handle status change
    select.addEventListener("change", async () => {
      await fetch(`${API}/orders/${order._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ statusKey: select.value })
      });
      loadOrders(); // refresh table
    });

    // Build row
    tr.innerHTML = `
      <td>${order.general_information?.patient_name || "-"}</td>
      <td>${order.items?.[0]?.hcpcs_code || "-"}</td>
      <td>${order.items?.[0]?.quantity || "-"}</td>
    `;
    const tdStatus = document.createElement("td");
    tdStatus.appendChild(select);
    tr.appendChild(tdStatus);

    tbody.appendChild(tr);
  });
}

loadOrders();
