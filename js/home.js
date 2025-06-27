document.addEventListener("DOMContentLoaded", () => {
  const tabs = ["info", "status", "plugins", "youtube"];
  tabs.forEach(t => {
    document.getElementById(`btn-${t}`).addEventListener("click", () => {
      tabs.forEach(x => document.getElementById(`btn-${x}`).classList.remove("active"));
      document.getElementById(`btn-${t}`).classList.add("active");
      showHome(t);
    });
  });
  showHome("info");
});

function showHome(view) {
  const container = document.getElementById("content-home");
  container.innerHTML = "";
  if (view === "info") {
    container.innerHTML = `
      <h2>🌍 Server Info</h2>
      <p><strong>IP:</strong> mc1524209.fmcs.cloud</p>
      <p><strong>Port:</strong> 47112</p>
      <p><strong>Version:</strong> Java 1.21.4 + Bedrock</p>`;
  } else if (view === "status") {
    container.innerHTML = `<h2>📊 Status</h2><p id="statusMsg">Loading...</p>`;
    fetch("https://api.mcstatus.io/v2/status/java/mc1524209.fmcs.cloud")
      .then(r => r.json())
      .then(d => {
        document.getElementById("statusMsg").innerHTML = 
          d.online ? `✅ Online — ${d.players.online} players` : `❌ Offline`;
      });
  } else if (view === "plugins") {
    const plugins = [
      { name: "LuckPerms", url: "https://modrinth.com/plugin/luckperms" },
      { name: "ViaVersion", url: "https://modrinth.com/plugin/viaversion" },
      // add more...
    ];
    container.innerHTML = `<h2>🔌 Plugins</h2><ul id="plugin-list">${
      plugins.map(p => `<li>${p.name} <a href="${p.url}" target="_blank">Details ↗</a></li>`).join("")
    }</ul>`;
  } else if (view === "youtube") {
    container.innerHTML = `
      <h2>▶ Watch Tutorials</h2>
      <p><a href="https://youtu.be/example" target="_blank" class="link-btn">Watch on YouTube</a></p>`;
  }
}
