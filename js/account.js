const WORKER_URL = 'https://your-cloudflare-worker.workers.dev';
let allAccounts = {};

async function loadAccounts() {
  try {
    const res = await fetch(WORKER_URL);
    allAccounts = await res.json();
  } catch (err) {
    console.error('Failed to load accounts:', err);
    allAccounts = {};
  }
}

async function saveAccounts() {
  try {
    await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allAccounts)
    });
  } catch (err) {
    console.error('Failed to save accounts:', err);
  }
}

function hash(str) {
  return btoa(unescape(encodeURIComponent(str))); // fake simple hash (replace with SHA256 if needed)
}

function generateAvatar(username) {
  const letter = username[0].toUpperCase();
  const color = '#' + Math.floor(Math.random()*16777215).toString(16);
  return `<div style="width:50px;height:50px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:24px;">${letter}</div>`;
}

function renderProfile(username) {
  const user = allAccounts[username];
  const pic = user.pfp ? `<img src="${user.pfp}" width="50" style="border-radius:50%">` : generateAvatar(username);
  document.getElementById('profile-box').innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      ${pic}
      <div>
        <strong>${user.username}</strong><br>
        ${user.mc_id} (${user.platform})
      </div>
    </div>
  `;
}

async function handleLoginOrCreate() {
  const user = document.getElementById('acc-username').value.trim().toLowerCase();
  const pass = document.getElementById('acc-password').value.trim();
  const mcId = document.getElementById('mc-id').value.trim();
  const platform = document.querySelector('input[name="platform"]:checked')?.value;
  const agreed = document.getElementById('agree').checked;

  if (!user || !pass || !mcId || !platform) {
    alert('Please fill all required fields.');
    return;
  }

  await loadAccounts();

  if (allAccounts[user]) {
    // login
    if (allAccounts[user].password !== hash(pass)) {
      alert('Wrong password!');
      return;
    }
    alert('Logged in successfully!');
    localStorage.setItem('acc_user', user);
    renderProfile(user);
  } else {
    // create
    if (!agreed) {
      alert('You must agree to the rules to create an account.');
      return;
    }

    // Check if MC ID already used
    const mcIdExists = Object.values(allAccounts).some(u => u.mc_id.toLowerCase() === mcId.toLowerCase());
    if (mcIdExists) {
      alert('This Minecraft ID is already registered.');
      return;
    }

    allAccounts[user] = {
      username: user,
      password: hash(pass),
      mc_id: mcId,
      platform: platform,
      discord: '',
      instagram: '',
      pfp: '',
      created: new Date().toISOString()
    };

    await saveAccounts();
    alert('Account created!');
    localStorage.setItem('acc_user', user);
    renderProfile(user);
  }
}

function showAccountForm() {
  document.getElementById('account-form').innerHTML = `
    <h2>Create / Login Account</h2>
    <input type="text" id="acc-username" placeholder="Account Username">
    <input type="password" id="acc-password" placeholder="Password">
    <input type="text" id="mc-id" placeholder="Minecraft Username">
    <div>
      <label><input type="radio" name="platform" value="Java"> Java</label>
      <label><input type="radio" name="platform" value="Bedrock"> Bedrock</label>
    </div>
    <label>
      <input type="checkbox" id="agree">
      I agree to the <a href="https://minecraft2613.github.io/Minecarft-2613-Rules/" target="_blank">server rules</a>.
    </label>
    <button onclick="handleLoginOrCreate()">Submit</button>
  `;
}

// Auto load profile if exists
window.addEventListener('DOMContentLoaded', async () => {
  const user = localStorage.getItem('acc_user');
  if (user) {
    await loadAccounts();
    if (allAccounts[user]) renderProfile(user);
  } else {
    showAccountForm();
  }
});
function showEditProfile() {
  const user = localStorage.getItem('acc_user');
  if (!user || !allAccounts[user]) return;

  const u = allAccounts[user];
  document.getElementById('profile-edit').innerHTML = `
    <h3>Edit Profile</h3>
    <input type="text" id="edit-display" value="${u.username}" disabled><br>
    <input type="text" id="edit-mcid" value="${u.mc_id}" placeholder="Minecraft ID"><br>
    <label><input type="radio" name="edit-platform" value="Java" ${u.platform === 'Java' ? 'checked' : ''}> Java</label>
    <label><input type="radio" name="edit-platform" value="Bedrock" ${u.platform === 'Bedrock' ? 'checked' : ''}> Bedrock</label><br>
    <input type="text" id="edit-discord" value="${u.discord}" placeholder="Discord (optional)"><br>
    <input type="text" id="edit-instagram" value="${u.instagram}" placeholder="Instagram (optional)"><br>
    <input type="text" id="edit-pfp" value="${u.pfp}" placeholder="Profile Picture URL"><br>
    <button onclick="saveProfileEdit()">✅ Save Changes</button>
  `;
  document.getElementById('profile-edit').style.display = 'block';
}

async function saveProfileEdit() {
  const user = localStorage.getItem('acc_user');
  if (!user || !allAccounts[user]) return;

  allAccounts[user].mc_id = document.getElementById('edit-mcid').value.trim();
  allAccounts[user].platform = document.querySelector('input[name="edit-platform"]:checked').value;
  allAccounts[user].discord = document.getElementById('edit-discord').value.trim();
  allAccounts[user].instagram = document.getElementById('edit-instagram').value.trim();
  allAccounts[user].pfp = document.getElementById('edit-pfp').value.trim();

  await saveAccounts();
  alert("✅ Profile updated!");
  renderProfile(user);
  document.getElementById('profile-edit').style.display = 'none';
}
