const sidebar = document.getElementById("sidebar");
document.getElementById("menuToggle").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

function showSection(id) {
  document.querySelectorAll("section.section").forEach(s => s.classList.remove("active"));
  document.getElementById("home").classList.remove("active");
  document.getElementById("main-content")?.classList.add("active");
  const target = document.getElementById(id);
  if (target) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    target.classList.add("active");
  }
  sidebar.classList.remove("open");
}

// Menu routing
document.getElementById("themeMenu").addEventListener("click", () => showSection("menu-theme"));
document.getElementById("contactMenu").addEventListener("click", () => showSection("contact"));
document.getElementById("playersMenu").addEventListener("click", () => showSection("players"));

// Setup theme and contact sections
document.getElementById("menu-theme").innerHTML = `
<h2>Theme Settings</h2>
<p>Use theme panel above</p>`;
document.getElementById("contact").innerHTML = `
<h2>Contact Us</h2>
<p>Send your message using the contact form</p>`;
document.getElementById("players").innerHTML = `
<h2>Player Listings</h2>
<button id="allPlayersBtn" class="link-btn">All Players</button>
<button id="top3Btn" class="link-btn">Top 3 Richest</button>
<div id="playersContent"></div>`;

document.getElementById("allPlayersBtn").addEventListener("click", () => displayPlayers(false));
document.getElementById("top3Btn").addEventListener("click", () => displayPlayers(true));

function displayPlayers(top3) {
  const dummy = ["Steve", "Alex", "Player1", "RichGuy", "Noob"];
  const container = document.getElementById("playersContent");
  let list = top3 ? dummy.sort().slice(0, 3) : dummy;
  container.innerHTML = `<ul>${list.map(n => `<li>${n}</li>`).join("")}</ul>`;
}
