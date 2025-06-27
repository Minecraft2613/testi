
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-toggle");
  const menuPanel = document.getElementById("menu-panel");

  if (menuBtn && menuPanel) {
    menuBtn.addEventListener("click", () => {
      menuPanel.classList.toggle("active");
    });
  }

  const username = localStorage.getItem("mcUsername") || "U";
  const avatar = document.getElementById("profile-avatar");
  if (avatar && !avatar.innerText) {
    avatar.innerText = username.charAt(0).toUpperCase();
  }
});
