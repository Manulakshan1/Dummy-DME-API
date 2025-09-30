const API = "http://52.33.189.195:4000/api";
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
         <button onclick="viewOrders('${dme._id}', '${encodeURIComponent(dme.name)}')">View Orders</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function viewOrders(dmeId, dmeName) {
  const cleanName = decodeURIComponent(dmeName);
  const dme = dmeName.replace(/\s+/g, "-").toLowerCase();
  window.location.href = `orders.html?dmeId=${dmeId}&dme=${dme}`;
}


loadDMEs();

document.getElementById("logoutBtn").addEventListener("click", () => {
  // Remove token from localStorage
  localStorage.removeItem("token");

  // Redirect to login page
  window.location.href = "index.html";
});
