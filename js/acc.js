
const CLOUDFLARE_URL = 'https://minecraft-details-acc.1987sakshamsingh.workers.dev/';
const CLOUDFLARE_TOKEN = 'your_token_here';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("username");
    const user = input.value.trim();

    if (!user) return alert("Enter username");

    const res = await fetch(CLOUDFLARE_URL).then(r => r.json()).catch(() => null);
    if (res?.players?.find(p => p.mc_id === user)) {
      alert("Logged in");
    } else {
      res.players.push({ mc_id: user, acc_name: user, acc_pass: "1234", type: "java" });
      await fetch(CLOUDFLARE_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(res)
      });
      alert("Account created!");
    }

    localStorage.setItem("mcUsername", user);
    location.reload();
  });
});
