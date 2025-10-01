const API = "http://34.214.183.199:4000/api";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("error").textContent = data.message || "Registration failed";
      return;
    }

    alert("Registration successful! Please login.");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Register error:", err);
    document.getElementById("error").textContent = "Something went wrong!";
  }
});
