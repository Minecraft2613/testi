document.getElementById("accountMenu").addEventListener("click", () => {
  showSection("account");
  renderAccount();
});

function renderAccount() {
  const acc = localStorage.getItem("account");
  const section = document.getElementById("account");
  section.innerHTML = acc ? buildProfileForm(JSON.parse(acc)) : buildNewAccountForm();
}

function buildNewAccountForm() {
  return `
  <h2>Create Account</h2>
  <form id="newAccForm">
    <input type="text" id="accName" placeholder="Account Name" required>
    <input type="text" id="minecraftId" placeholder="Minecraft ID" required>
    <input type="password" id="accPass" placeholder="Password" required>
    <input type="text" id="discord" placeholder="Discord (optional)">
    <input type="text" id="instagram" placeholder="Instagram (optional)">
    <button>Create</button>
  </form>`;
}

function buildProfileForm(data) {
  return `
  <h2>Edit Profile</h2>
  <form id="editAccForm">
    <input type="text" id="accName" value="${data.accName}" required>
    <input type="text" id="minecraftId" value="${data.minecraftId}" required>
    <input type="text" id="discord" value="${data.discord}">
    <input type="text" id="instagram" value="${data.instagram}">
    <button>Save Changes</button>
  </form>`;
}

document.addEventListener("submit", e => {
  if (e.target.id === "newAccForm" || e.target.id === "editAccForm") {
    e.preventDefault();
    const data = {
      accName: document.getElementById("accName").value,
      minecraftId: document.getElementById("minecraftId").value,
      discord: document.getElementById("discord").value,
      instagram: document.getElementById("instagram").value
    };
    localStorage.setItem("account", JSON.stringify(data));
    alert("Saved!");
    renderAccount();
  }
});
