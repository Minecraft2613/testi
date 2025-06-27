document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".tab-section");

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      sections.forEach(s => s.style.display = "none");

      btn.classList.add("active");
      document.getElementById(btn.dataset.target).style.display = "block";
    });
  });

  tabs[0].click();

  fetch("https://api.mcstatus.io/v2/status/java/mc1524209.fmcs.cloud:38762")
    .then(res => res.json())
    .then(data => {
      document.getElementById("server-status").textContent = data.online ? "🟢 Online" : "🔴 Offline";
      document.getElementById("player-count").textContent = data.players ? `Players: ${data.players.online}` : "No players online";
    })
    .catch(() => {
      document.getElementById("server-status").textContent = "⚠️ Error checking status";
    });
});
