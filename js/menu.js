const sidebar = document.getElementById('sidebar');
document.getElementById('menuToggle').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  sidebar.classList.remove('open');
}

document.getElementById('homeMenu').addEventListener('click', () => showSection('home'));
document.getElementById('themeMenu').addEventListener('click', () => showSection('themeSettings'));
document.getElementById('contactMenu').addEventListener('click', () => showSection('contact'));
document.getElementById('playersMenu').addEventListener('click', () => showSection('players'));

document.getElementById('themeSettings').innerHTML = `<h2>Theme Settings</h2><p>Use CSS theme panel above</p>`;
document.getElementById('contact').innerHTML = `
  <h2>Contact Us</h2>
  <form id="contactForm">
    <input type="text" id="mcId" placeholder="Minecraft ID" required>
    <input type="text" id="contactDiscord" placeholder="Discord or Instagram ID" required>
    <textarea id="issue" placeholder="Describe your issue..." rows="4" required></textarea>
    <button type="submit">Submit</button>
  </form>`;
document.getElementById('players').innerHTML = `
  <h2>Player Lists</h2>
  <button id="allPlayersBtn" class="link-btn">All Players</button>
  <button id="top3Btn" class="link-btn">Top 3 Richest</button>
  <div id="playersContent"></div>`;

document.getElementById('allPlayersBtn').addEventListener('click', () => showPlayers(false));
document.getElementById('top3Btn').addEventListener('click', () => showPlayers(true));

function showPlayers(top3) {
  const players = ['Steve','Alex','Miner1','Richie','DiamondPro'];
  let list = top3 ? players.slice(0, 3) : players;
  document.getElementById('playersContent').innerHTML = '<ul>' + list.map(p => `<li>${p}</li>`).join('') + '</ul>';
}

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    mcId: document.getElementById('mcId').value,
    contact: document.getElementById('contactDiscord').value,
    issue: document.getElementById('issue').value,
  };
  console.log("Issue reported:", data);
  alert('Submitted! Admin will respond soon.');
});
