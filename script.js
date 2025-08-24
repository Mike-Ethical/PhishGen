const generateBtn = document.getElementById('generatePageBtn');
const previewBox = document.getElementById('previewBox');
const previewFrame = document.getElementById('previewFrame');
const downloadBtn = document.getElementById('downloadBtn');
const deployBtn = document.getElementById('deployBtn');
const genNameInput = document.getElementById('genName');
const serverLinkInput = document.getElementById('serverLink');

const htmlTemplate = (name, link) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
<h1>${name}</h1>
<div class="box" id="generateBox">
<button id="generateBtn">Generate Pet</button>
</div>
<div class="box" id="loadingBox" style="display:none;">
<p>Generating your pet...</p>
</div>
<div class="box" id="petBox" style="display:none;">
<p id="petNameText">Your Pet:</p>
<button id="joinServerBtn">Join Private Server</button>
</div>
<script src="script.js"></script>
<script>
const generateBtn = document.getElementById('generateBtn');
const loadingBox = document.getElementById('loadingBox');
const petBox = document.getElementById('petBox');
const petNameText = document.getElementById('petNameText');
const joinServerBtn = document.getElementById('joinServerBtn');
const pets = ["Raccoon","Dragonfly","Mimic Octopus","Queen Bee"];
generateBtn.addEventListener('click', () => {
generateBtn.style.display="none";
loadingBox.style.display="block";
setTimeout(() => {
loadingBox.style.display="none";
const randomPet = pets[Math.floor(Math.random()*pets.length)];
petNameText.textContent="Your Pet: "+randomPet;
petBox.style.display="block";
},1500);
});
joinServerBtn.addEventListener('click', ()=>{window.location.href="${link}";});
</script>
</div>
</body>
</html>
`;

const cssTemplate = `
body { background:#0a1e3d; color:#e0e7ff; font-family:Arial; display:flex; justify-content:center; align-items:flex-start; min-height:100vh; margin:0; padding:20px; }
.container { background:#11294d; padding:20px; border-radius:10px; width:100%; max-width:400px; text-align:center; }
h1 { color:#7dd3fc; margin-bottom:15px; }
.box { background:#1e3a5f; padding:10px; border-radius:8px; margin-bottom:10px; border:1px solid #3b82f6; }
button { padding:10px 15px; background:#3b82f6; color:white; border:none; border-radius:8px; cursor:pointer; transition:0.3s; margin:5px 0; }
button:hover { background:#2563eb; transform:scale(1.05); }
`;

const jsTemplate = `
// This file is optional since the script is included inline in HTML
`;

generateBtn.addEventListener('click', () => {
  const name = genNameInput.value.trim() || "MyPetGen";
  const link = serverLinkInput.value.trim();
  if(!link) return alert("Enter your server link!");

  const htmlBlob = new Blob([htmlTemplate(name, link)], {type:"text/html"});
  const cssBlob = new Blob([cssTemplate], {type:"text/css"});
  const jsBlob = new Blob([jsTemplate], {type:"text/javascript"});

  const htmlURL = URL.createObjectURL(htmlBlob);
  const cssURL = URL.createObjectURL(cssBlob);
  const jsURL = URL.createObjectURL(jsBlob);

  previewBox.style.display="block";
  previewFrame.src = htmlURL;

  downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = htmlURL;
    a.download = "index.html";
    a.click();

    const b = document.createElement('a');
    b.href = cssURL;
    b.download = "style.css";
    b.click();

    const c = document.createElement('a');
    c.href = jsURL;
    c.download = "script.js";
    c.click();
  };

  deployBtn.onclick = () => {
    window.open("https://app.netlify.com/drop", "_blank");
  };
});
