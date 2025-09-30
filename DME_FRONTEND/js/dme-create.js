document.getElementById("dmeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dmeNameInput = document.getElementById("dmeName");
  if (!dmeNameInput) {
    console.error("Element with id='dmeName' not found in the DOM!");
    return;
  }

  const name = dmeNameInput.value.trim();
  if (!name) {
    alert("Please enter a DME name");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://54.214.90.133:4000/api/dmes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert("Error: " + errorData.message);
      return;
    }

    alert("DME created successfully!");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Error creating DME:", err);
    alert("Failed to create DME. Check console for details.");
  }
});
