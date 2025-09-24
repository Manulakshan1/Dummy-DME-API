const API = "http://localhost:4000/api";
const token = localStorage.getItem("token");

async function loadDMEs() {
  const res = await fetch(`${API}/dmes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const dmes = await res.json();

  const tbody = document.getElementById("dmeTableBody");
  tbody.innerHTML = "";

  dmes.forEach(dme => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${dme.name}</td>
      <td>${new Date(dme.createdAt).toLocaleDateString()}</td>
      <td>
        <button onclick="viewOrders('${dme._id}')">View Orders</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function viewOrders(dmeId) {
  window.location.href = `orders.html?dmeId=${dmeId}`;
}

loadDMEs();

document.getElementById("logoutBtn").addEventListener("click", () => {
  // Remove token from localStorage
  localStorage.removeItem("token");

  // Redirect to login page
  window.location.href = "index.html";
});
