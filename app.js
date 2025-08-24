// Roblox Pet Generator — fixed profile lookup with CORS-safe options
const CONFIG = {
  // Use "roproxy" (default) to route Roblox API calls through a free CORS proxy host.
  // If you deploy your own proxy/worker (recommended), set mode to "custom" and fill customBase.
  mode: "roproxy", // "roproxy" | "custom" | "direct"
  customBase: "",  // e.g. "https://your-worker.example.workers.dev"
  // Private server join URL (you can change this)
  joinUrl: "https://roblox.com.ge/games/126884695634066/Grow-a-Garden?privateServerLinkCode=98362791523092484699268245505483"
};

// Five 'divine' pets (names only, icons are emojis)
const PETS = [
  { name: "Dragonfly", icon: "🦋" }, // using butterfly as a friendly icon
  { name: "Raccoon", icon: "🦝" },
  { name: "Queen Bee", icon: "🐝" },
  { name: "Mimic Octopus", icon: "🐙" },
  { name: "Kitsune", icon: "🦊" }
];

function usersBase(){
  if (CONFIG.mode === "roproxy") return "https://users.roproxy.com";
  if (CONFIG.mode === "custom")  return CONFIG.customBase + "/users";
  return "https://users.roblox.com"; // may CORS-block on static hosting
}

function setHidden(id, hidden){
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("hidden", hidden);
}
function showError(msg){
  const el = document.getElementById("error");
  el.textContent = msg;
  setHidden("error", false);
}
function clearError(){
  const el = document.getElementById("error");
  el.textContent = "";
  setHidden("error", true);
}

async function getUserByUsername(username){
  // Roblox official endpoint (POST). On browsers this usually needs a proxy because of CORS.
  const url = usersBase() + "/v1/usernames/users";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
  });
  if (!res.ok){
    const text = await res.text().catch(()=> "");
    throw new Error(`Roblox API error ${res.status}: ${text.slice(0,200)}`);
  }
  const json = await res.json();
  const row = json?.data?.[0];
  if (!row) throw new Error("User not found");
  return { id: row.id, username: row.name, displayName: row.displayName || row.name };
}

function headshotUrl(userId){
  // Use an image endpoint so we can set it directly as <img src> without CORS JSON.
  // Several legacy URL shapes exist; this one still serves images as of 2025.
  return `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`;
}

async function onLookup(e){
  e.preventDefault();
  clearError();
  setHidden("profile", true);
  setHidden("generator", true);

  const u = document.getElementById("username").value.trim();
  if (!u) return;

  try{
    const user = await getUserByUsername(u);
    // Fill profile card
    document.getElementById("displayName").textContent = user.displayName;
    document.getElementById("name").textContent = user.username;
    const img = document.getElementById("avatar");
    img.src = headshotUrl(user.id);
    img.alt = `${user.username} avatar`;
    img.onerror = () => {
      // graceful fallback to initials if image fails
      img.style.display = "none";
      const ph = document.createElement("div");
      ph.textContent = user.username.slice(0,1).toUpperCase();
      ph.className = "avatar placeholder";
    };
    setHidden("profile", false);
    setHidden("generator", false);
  }catch(err){
    console.error(err);
    let tip = "";
    if (CONFIG.mode === "direct"){
      tip = " (Tip: switch CONFIG.mode to 'roproxy' in app.js or deploy the included Cloudflare Worker proxy.)";
    }
    showError(`Couldn't find that profile or the request was blocked by CORS. ${err.message}${tip}`);
  }
}

function pickPet(){
  return PETS[Math.floor(Math.random() * PETS.length)];
}

function init(){
  document.getElementById("lookupForm").addEventListener("submit", onLookup);

  // Generate button
  document.getElementById("genBtn").addEventListener("click", () => {
    const pet = pickPet();
    document.getElementById("petName").textContent = pet.name;
    document.getElementById("petIcon").textContent = pet.icon;
    setHidden("petCard", false);

    const join = document.getElementById("joinLink");
    join.href = CONFIG.joinUrl || "#";
    setHidden("claim", false);
  });
}

document.addEventListener("DOMContentLoaded", init);
