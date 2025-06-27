document.addEventListener("DOMContentLoaded", () => {
  const tabs = ['serverDetails', 'plugins', 'howTo'];
  tabs.forEach(tab => {
    document.getElementById(`btn-${tab}`)
      .addEventListener("click", () => switchTab(tab));
  });
  switchTab('serverDetails');
  loadHomeProfile();
});

function switchTab(tab) {
  document.querySelectorAll('.btn-group button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-${tab}`).classList.add('active');
  renderHome(tab);
}

function renderHome(tab) {
  const container = document.getElementById('content-home');
  container.innerHTML = '';
  if (tab === 'serverDetails') {
    container.innerHTML = `
      <h2>🌍 Server Info</h2>
      <p><strong>IP:</strong> mc1524209.fmcs.cloud</p>
      <p><strong>Port:</strong> 47112</p>
      <h2>📊 Status</h2>
      <p id="statusMsg">Loading...</p>`;
    fetch("https://api.mcstatus.io/v2/status/java/mc1524209.fmcs.cloud")
      .then(r => r.json())
      .then(d => {
        document.getElementById("statusMsg").innerText = d.online
          ? `✅ Online — ${d.players.online} players: ${d.players.list.join(', ')}`
          : '❌ Offline';
      });
  } else if (tab === 'plugins') {
    const pluginList = [
      {name:'LuckPerms',url:'https://modrinth.com/plugin/luckperms', yt: ''},
      {name:'ViaVersion',url:'https://modrinth.com/plugin/viaversion', yt:''}
    ];
    container.innerHTML = `<h2>🔌 Plugins</h2><ul id="plugin-list"></ul>`;
    const ul = document.getElementById('plugin-list');
    pluginList.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${p.name}</span>
        <span>
          <a href="${p.url}" target="_blank">Details ↗</a>
          ${p.yt 
            ? `<a class="link-btn" href="${p.yt}" target="_blank">Watch</a>`
            : `<span style="margin-left:8px;color:${'var(--text-muted)'}">No tutorial</span>`
          }
        </span>`;
      ul.append(li);
    });
  } else {
    container.innerHTML = `
      <h2>🎮 How to Play & Start</h2>
      <ol>
        <li>Open Minecraft → Multiplayer → Add Server</li>
        <li>IP: mc1524209.fmcs.cloud | Port: 47112</li>
        <li>Click “Join”</li>
        <li>If offline → Click “Start Server” on FreeMcServer page</li>
      </ol>`;
  }
}

function loadHomeProfile() {
  const acc = JSON.parse(localStorage.getItem('account') || 'null');
  document.getElementById('welcomeMsg').innerText = acc
    ? `Welcome, ${acc.minecraftId}!`
    : `Welcome, guest!`;
  const box = document.getElementById('profilePicBox');
  box.style.width = box.style.height = '50px';
  if (acc?.profilePic) {
    box.style.backgroundImage = `url(${acc.profilePic})`;
  } else if (acc?.minecraftId) {
    const c = acc.minecraftId.charAt(0).toUpperCase();
    box.innerText = c;
    box.style.background = '#444';
    box.style.color = '#fff';
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    box.style.fontSize = '1.5rem';
    box.style.borderRadius = '50%';
  }
}
