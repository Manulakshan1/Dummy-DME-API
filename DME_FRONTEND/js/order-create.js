const API = "http://54.214.90.133:4000/api";
const token = localStorage.getItem("token");

const urlParams = new URLSearchParams(window.location.search);
const dmeId = urlParams.get("dmeId");

document.getElementById("orderForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const patientName = document.getElementById("patientName").value;
  const dob = document.getElementById("dob").value;
  const hcpcs = document.getElementById("hcpcs").value;
  const quantity = document.getElementById("quantity").value;

  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      dme_id: dmeId,
      general_information: {
        patient_id: "TEMP123",
        practice_id: "PRACT123",
        patient_name: patientName
      },
      patient_details: {
        date_of_birth: dob,
        gender: "Male"
      },
      items: [{ product_name: "Test Product", hcpcs_code: hcpcs, quantity }]
    })
  });

  if (res.ok) {
    window.location.href = `orders.html?dmeId=${dmeId}`;
  } else {
    const data = await res.json();
    alert(data.message || "Failed to create order");
  }
});
