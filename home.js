
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const views = document.querySelectorAll(".tab-section");

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      views.forEach(s => s.style.display = "none");
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).style.display = "block";
    });
  });

  document.querySelector('[data-target="server-details"]').click();

  const statusBox = document.getElementById("server-status");
  const playerBox = document.getElementById("player-count");

  fetch("https://api.mcstatus.io/v2/status/java/mc1524209.fmcs.cloud:38762")
    .then(res => res.json())
    .then(data => {
      if (data.online) {
        statusBox.textContent = "🟢 Online";
        playerBox.textContent = data.players ? "Players: " + data.players.online : "No players";
      } else {
        statusBox.textContent = "🔴 Offline";
      }
    })
    .catch(() => {
      statusBox.textContent = "⚠️ Error checking status";
    });
});
