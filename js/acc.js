const CLOUDFLARE_URL = 'https://minecraft-details-acc.1987sakshamsingh.workers.dev/';
const CLOUDFLARE_TOKEN = 'your_token_here';

document.addEventListener("DOMContentLoaded", () => {
  const username = prompt("Enter your Minecraft username:");
  if (!username) return;

  fetch(CLOUDFLARE_URL)
    .then(r => r.json())
    .then(json => {
      let exists = json.players.some(p => p.mc_id === username);
      if (!exists) {
        json.players.push({ mc_id: username, acc_name: username, acc_pass: "1234", type: "java" });
        return fetch(CLOUDFLARE_URL, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${CLOUDFLARE_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(json)
        });
      }
    })
    .then(() => {
      localStorage.setItem("mcUsername", username);
    });
});
