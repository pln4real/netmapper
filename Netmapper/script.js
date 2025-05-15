// Initialisation des variables globales
// draggedType : stocke le type de nœud actuellement glissé depuis la sidebar.
// selectedNode : référence temporaire au nœud sélectionné pour la création de lien.
// canvas : zone principale où les nœuds seront déposés et connectés.

let draggedType = "";
let selectedNode = null;
const canvas = document.getElementById("canvas-area");

// Dictionnaire de correspondance des types
// Définit les noms lisibles à afficher pour chaque type de nœud réseau (ex. 'printer' devient 'Imprimante').

const typeLabels = {
  pc: "PC",
  laptop: "Ordinateur portable",
  smartphone: "Smartphone",
  printer: "Imprimante",   // 🟢 Ce mot s’affichera à la place de "printer"
  wifi: "Wi-Fi",
  routeur: "Routeur",
  switch: "Switch"
};

//  Objet de suivi de l'état réseau
// Contient toutes les informations nécessaires à la topologie :
// - links : liste des connexions entre les nœuds,
// - nodeInfo : métadonnées de chaque nœud (IP, MAC, etc.),
// - ipAllocations : suivi des IP attribuées pour chaque Wi-Fi,
// - typeCounters : compteur par type pour générer des noms uniques.

const state = {
  links: [],
  nodeInfo: {},
  ipAllocations: {},
  typeCounters: {
    pc: 0, laptop: 0, smartphone: 0, printer: 0,
    wifi: 0, routeur: 0, switch: 0
  }
};
//  Générateur d'adresse MAC aléatoire
// Crée une adresse MAC fictive composée de chiffres et lettres hexadécimales.

function generateMAC() {
  return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]);
}

// Générateur d'adresse IP disponible
// À partir d'une base (ex: 192.168.1.1) et d'une liste d'IP déjà utilisées,
// attribue la prochaine IP disponible dans le sous-réseau.

function generateIP(base, used) {
  let i = 10;
  while (used.includes(i)) i++;
  used.push(i);
  return base.split('.').slice(0, 3).join('.') + '.' + i;
}
//  Calcule la qualité du signal Wi-Fi selon la distance
// Retourne un objet avec :
// - signal : qualité du signal (Bonne, Moyenne, Faible)
// - speed : vitesse théorique correspondante

function calculateSignalQuality(d) {
  if (d < 150) return { signal: "Bonne", speed: "100 Mbps" };
  if (d < 300) return { signal: "Moyenne", speed: "50 Mbps" };
  return { signal: "Faible", speed: "10 Mbps" };
}
// Fonction d'ouverture/fermeture de menu
// Utilisé pour afficher ou masquer une section de menu avec effet de rotation du chevron.

function toggleMenu(id) {
  const list = document.getElementById(id);
  const chevron = list.previousElementSibling.querySelector('.fa-chevron-down');
  list.classList.toggle('open');
  chevron.style.transform = list.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
}


// 🧩 FONCTIONNALITÉ 1 : Création dynamique d’un nœud réseau
// Lorsqu’un utilisateur glisse un type de matériel (PC, laptop, etc.) sur le canvas,
// cette fonction crée un élément DOM correspondant, l’ajoute à l’interface, lui assigne un identifiant,
// initialise ses informations réseau, et le rend interactif.

function createNode(type, x, y) {
  const id = Date.now().toString();
  state.typeCounters[type]++;

  const label = `${typeLabels[type] || type}${state.typeCounters[type]}`;
  const node = document.createElement('div');
  node.className = 'network-node';
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.dataset.id = id;
  node.dataset.type = type;
  node.title = label;
  node.innerHTML = `<i class="fas fa-${getIcon(type)}"></i><span class="node-label">${label}</span><input class="edit-label" type="text" style="display:none;" />`;

  state.nodeInfo[id] = {
    name: label, type, ip: "", mask: "255.255.255.0", mac: generateMAC(), speed: "", startTime: null, signal: ""
  };

  if (type === "wifi") {
    let baseIP;
    do {
      baseIP = prompt("Attribuez une adresse IP au Wi-Fi (ex: 192.168.1.1):");
    } while (!/^\d+\.\d+\.\d+\.\d+$/.test(baseIP));
    state.nodeInfo[id].ip = baseIP;
    state.ipAllocations[id] = { reserved: [], devices: [] };
  }

  canvas.appendChild(node);
  makeDraggable(node);
  attachNodeEvents(node);
  saveNetworkState();
}

function getIcon(type) {
  const icons = {
    pc: 'desktop', laptop: 'laptop', smartphone: 'mobile-alt', printer: 'print',
    wifi: 'wifi', routeur: 'broadcast-tower', switch: 'ethernet'
  };
  return icons[type] || 'question';
}

function makeDraggable(node) {
  let offsetX = 0, offsetY = 0, dragging = false;

  node.addEventListener('mousedown', e => {
    offsetX = e.offsetX; offsetY = e.offsetY; dragging = true; node.style.zIndex = 10;
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    node.style.left = `${e.clientX - canvas.getBoundingClientRect().left - offsetX}px`;
    node.style.top = `${e.clientY - canvas.getBoundingClientRect().top - offsetY}px`;
    updateSignalIfNeeded(node);
    redrawLinks();
  });
  document.addEventListener('mouseup', () => { dragging = false; node.style.zIndex = 5; });
}

function attachNodeEvents(node) {
  node.addEventListener('click', () => handleNodeClick(node));
  node.addEventListener('dblclick', () => editNodeLabel(node));
  node.addEventListener('mouseenter', () => updateTooltip(node));
}


// 🔗 FONCTIONNALITÉ 3 : Création de connexions entre deux nœuds
// Lorsqu’un utilisateur clique successivement sur deux nœuds compatibles,
// un lien logique est créé (avec vérification des règles métier) et affiché visuellement.

function handleNodeClick(node) {
  if (!selectedNode) {
    selectedNode = node;
    node.style.borderColor = "orange";
    return;
  }

  const from = selectedNode;
  const to = node;
  const fromId = from.dataset.id;
  const toId = to.dataset.id;
  const fromType = from.dataset.type;
  const toType = to.dataset.type;

  if (fromId === toId || !canConnect(fromId, toId)) {
    resetSelection();
    return;
  }

  if (!state.links.some(l => (l.from === fromId && l.to === toId) || (l.from === toId && l.to === fromId))) {
    state.links.push({ from: fromId, to: toId });
    assignIPIfNeeded(fromId, toId);
  }

  resetSelection();
  redrawLinks();
}

function canConnect(fromId, toId) {
  const deviceTypes = ["pc", "laptop", "smartphone", "printer"];
  const networkTypes = ["wifi", "routeur", "switch"];
  const t1 = state.nodeInfo[fromId].type;
  const t2 = state.nodeInfo[toId].type;

  if (deviceTypes.includes(t1) && deviceTypes.includes(t2)) return false;

  const connectedTo = id => state.links.filter(l => l.from === id || l.to === id).map(l => (l.from === id ? l.to : l.from));
  const getTypes = ids => ids.map(id => state.nodeInfo[id]?.type);

  const connectedTypes1 = getTypes(connectedTo(fromId));
  const connectedTypes2 = getTypes(connectedTo(toId));

  const isDevice = t => ["pc", "laptop", "smartphone", "printer"].includes(t);

// 🔒 Règle appliquée uniquement aux appareils
if (
  (isDevice(t1) && networkTypes.includes(t2) &&
   connectedTypes1.some(type => type !== t2 && networkTypes.includes(type))) ||

  (isDevice(t2) && networkTypes.includes(t1) &&
   connectedTypes2.some(type => type !== t1 && networkTypes.includes(type)))
) {
  alert("Connexion refusée : un appareil ne peut pas être connecté à plusieurs types de réseau.");
  return false;
}


  return true;
}

//  FONCTIONNALITÉ 2 : Attribution automatique d’adresse IP et gestion du DHCP simplifié
// Lorsqu’un appareil est connecté à un Wi-Fi ou une infrastructure réseau, une IP lui est automatiquement attribuée
// depuis la plage disponible selon le type d’appareil (client ou équipement réseau).

function assignIPIfNeeded(a, b) {
  const A = state.nodeInfo[a], B = state.nodeInfo[b];
  const isDevice = t => ["pc", "laptop", "smartphone", "printer"].includes(t);
  const isInfra = t => ["routeur", "switch"].includes(t);
  const deviceId = isDevice(A.type) ? a : isDevice(B.type) ? b : null;
  const infraId = isInfra(A.type) ? a : isInfra(B.type) ? b : null;

  const wifiId = Object.keys(state.nodeInfo).find(id => state.nodeInfo[id].type === "wifi" && state.nodeInfo[id].ip);
  if (!wifiId) return;

  const baseSegments = state.nodeInfo[wifiId].ip.split(".");
  const allocations = state.ipAllocations[wifiId];

  if (deviceId && !state.nodeInfo[deviceId].ip) {
    let i = 16;
    while (allocations.devices.includes(i)) i++;
    allocations.devices.push(i);
    state.nodeInfo[deviceId].ip = `${baseSegments[0]}.${baseSegments[1]}.${baseSegments[2]}.${i}`;
    state.nodeInfo[deviceId].startTime = new Date();
    updateSignalIfNeeded(document.querySelector(`[data-id='${deviceId}']`));
  }

  if (infraId && !state.nodeInfo[infraId].ip) {
    let i = 2;
    while (allocations.reserved.includes(i) && i <= 15) i++;
    if (i <= 15) {
      allocations.reserved.push(i);
      state.nodeInfo[infraId].ip = `${baseSegments[0]}.${baseSegments[1]}.${baseSegments[2]}.${i}`;
    }
  }

  saveNetworkState();
}

// 📶 FONCTIONNALITÉ 4 : Calcul de la qualité du signal Wi-Fi selon la distance
// Lorsqu’un appareil est connecté au Wi-Fi, cette fonction estime la qualité du signal
// (bonne, moyenne, faible) ainsi que le débit réseau simulé, en fonction de sa position à l’écran.

function updateSignalIfNeeded(deviceNode) {
  const deviceId = deviceNode.dataset.id;
  const wifiId = Object.keys(state.nodeInfo).find(id => state.nodeInfo[id].type === "wifi");
  if (!wifiId) return;
  const wifiNode = document.querySelector(`[data-id='${wifiId}']`);
  const dx = deviceNode.offsetLeft - wifiNode.offsetLeft;
  const dy = deviceNode.offsetTop - wifiNode.offsetTop;
  const { signal, speed } = calculateSignalQuality(Math.hypot(dx, dy));
  state.nodeInfo[deviceId].signal = signal;
  state.nodeInfo[deviceId].speed = speed;
}

function updateTooltip(node) {
  const info = state.nodeInfo[node.dataset.id];
  const now = new Date();
  const duration = info.startTime ? Math.floor((now - new Date(info.startTime)) / 1000) : 0;
  const isDevice = ["pc", "laptop", "smartphone", "printer"].includes(info.type);

  let tooltip = `Nom: ${info.name}
  IP: ${info.ip}
  Masque: ${info.mask}
  MAC: ${info.mac}`;
  

if (isDevice) {
  tooltip += `
Débit: ${info.speed}
Signal: ${info.signal}
Temps de connexion: ${Math.floor(duration / 60)}m ${duration % 60}s`;
}

node.title = tooltip;

}
// 📝 FONCTIONNALITÉ 5 : Renommer un nœud réseau
// Permet à l’utilisateur de double-cliquer sur un nœud pour modifier son nom via un champ de saisie,
// ce qui met à jour l’affichage et les données internes du nœud.

function editNodeLabel(node) {
  const labelSpan = node.querySelector('.node-label');
  const input = node.querySelector('.edit-label');
  input.value = labelSpan.textContent;
  labelSpan.style.display = 'none';
  input.style.display = 'inline';
  input.focus();

  input.onblur = () => {
    if (input.value.trim()) {
      labelSpan.textContent = input.value.trim();
      node.title = input.value.trim();
      state.nodeInfo[node.dataset.id].name = input.value.trim();
    }
    input.style.display = 'none';
    labelSpan.style.display = 'inline';
  };
  input.onkeydown = e => { if (e.key === 'Enter') input.blur(); };
}

function resetSelection() {
  if (selectedNode) selectedNode.style.borderColor = "#4b7bec";
  selectedNode = null;
}

function updateWifiConnectionCount(wifiId) {
  const wifiNode = document.querySelector(`[data-id='${wifiId}']`);
  if (!wifiNode) return;

  let counter = wifiNode.querySelector('.wifi-count');
  if (!counter) {
    counter = document.createElement('div');
    counter.className = 'wifi-count';
    counter.style.position = 'absolute';
    counter.style.top = '-15px';
    counter.style.right = '-10px';
    counter.style.background = '#000';
    counter.style.color = '#fff';
    counter.style.fontSize = '12px';
    counter.style.padding = '2px 5px';
    counter.style.borderRadius = '10px';
    wifiNode.appendChild(counter);
  }

  const count = state.links.filter(link =>
    link.from === wifiId || link.to === wifiId
  ).filter(link => {
    const otherId = (link.from === wifiId ? link.to : link.from);
    const type = state.nodeInfo[otherId]?.type;
    return ["pc", "laptop", "smartphone", "printer"].includes(type);
  }).length;

  counter.textContent = count + ' connexions';

  if (count <= 5) {
    counter.style.background = 'green';
  } else if (count <= 7) {
    counter.style.background = 'orange';
  } else {
    counter.style.background = 'red';
  }
}

function getWifiConnectionCount(wifiId) {
  return state.links
    .filter(link => link.from === wifiId || link.to === wifiId)
    .filter(link => {
      const otherId = (link.from === wifiId) ? link.to : link.from;
      const type = state.nodeInfo[otherId]?.type;
      return ["pc", "laptop", "smartphone", "printer"].includes(type);
    }).length;
}


// FONCTIONNALITÉ 10 : Redessin automatique des liens réseau
// Chaque fois qu’un lien est créé, supprimé, ou qu’un nœud est déplacé,
// les lignes de connexion sont recalculées et redessinées avec couleur conditionnelle (Wi-Fi ou infrastructure).

function redrawLinks() {
  document.querySelectorAll(".link-line").forEach(e => e.remove());
  state.links.forEach(link => {
    const from = document.querySelector(`[data-id='${link.from}']`);
    const to = document.querySelector(`[data-id='${link.to}']`);
    if (!from || !to) return;
    const x1 = from.offsetLeft + from.offsetWidth / 2;
    const y1 = from.offsetTop + from.offsetHeight / 2;
    const x2 = to.offsetLeft + to.offsetWidth / 2;
    const y2 = to.offsetTop + to.offsetHeight / 2;
    const line = document.createElement('div');
    line.className = 'link-line';
    line.style.width = `${Math.hypot(x2 - x1, y2 - y1)}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg)`;
    let color = "green";

    // 🎯 Si le lien concerne un Wi-Fi
    if (from.dataset.type === "wifi" || to.dataset.type === "wifi") {
      const wifiId = from.dataset.type === "wifi" ? from.dataset.id : to.dataset.id;
      const count = getWifiConnectionCount(wifiId);
    
      if (count <= 5) {
        color = "green";   // 👍 Faible charge
      } else if (count <= 7) {
        color = "orange";  // ⚠️ Moyenne charge
      } else {
        color = "red";     // 🔴 Forte charge
      }
    
    // 🔁 Si le lien est entre un routeur et un switch
    } else if (
      (from.dataset.type === "routeur" && to.dataset.type === "switch") ||
      (from.dataset.type === "switch" && to.dataset.type === "switch") ||
      (from.dataset.type === "switch" && to.dataset.type === "routeur") ||
      (from.dataset.type === "routeur" && to.dataset.type === "routeur") ||
      (from.dataset.type === "routeur" && to.dataset.type === "switch") ||
      (from.dataset.type === "switch" && to.dataset.type === "routeur")
    ) {
      color = "gray";
    }

    line.style.backgroundColor = color;
    
    canvas.appendChild(line);
  });
}

// FONCTIONNALITÉ 7 : Sauvegarde et restauration automatique de la topologie
// Enregistre l’état actuel (nœuds, positions, connexions, adresses IP, etc.) dans le localStorage du navigateur.
// Au rechargement de la page, les données sont automatiquement restaurées.

function saveNetworkState() {
  const data = {
    nodes: Array.from(document.querySelectorAll('.network-node')).map(n => ({
      id: n.dataset.id, type: n.dataset.type, left: n.style.left, top: n.style.top,
      label: n.querySelector('.node-label').textContent
    })),
    links: state.links,
    nodeInfo: state.nodeInfo,
    ipAllocations: state.ipAllocations,
    typeCounters: state.typeCounters
  };
  localStorage.setItem("networkState", JSON.stringify(data));
}

// FONCTIONNALITÉ 7 : Sauvegarde et restauration automatique de la topologie
// Enregistre l’état actuel (nœuds, positions, connexions, adresses IP, etc.) dans le localStorage du navigateur.
// Au rechargement de la page, les données sont automatiquement restaurées.


function loadNetworkState() {
  const saved = JSON.parse(localStorage.getItem("networkState"));
  if (!saved) return;
  Object.assign(state, saved);
  saved.nodes.forEach(n => {
    const node = document.createElement('div');
    node.className = 'network-node';
    node.style.left = n.left;
    node.style.top = n.top;
    node.dataset.id = n.id;
    node.dataset.type = n.type;
    node.title = n.label;
    node.innerHTML = `<i class="fas fa-${getIcon(n.type)}"></i><span class="node-label">${n.label}</span><input class="edit-label" type="text" style="display:none;" />`;
    canvas.appendChild(node);
    makeDraggable(node);
    attachNodeEvents(node);
  });
  state.links = saved.links;
  redrawLinks();
}

window.addEventListener("DOMContentLoaded", () => {
  loadNetworkState();

  document.querySelectorAll('.sidebar li').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedType = item.getAttribute('data-type');
      e.dataTransfer.setData('text/plain', draggedType);
    });
  });

  canvas.addEventListener('dragover', (e) => e.preventDefault());

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    createNode(type, x, y);
  });

  const resetBtn = document.getElementById("reset-topology");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Supprimer toute la topologie ?")) {
        localStorage.removeItem("networkState");
        location.reload();
      }
    });
  }
  // === Gestion clic droit sur noeud ou lien ===
const contextMenu = document.createElement("div");
contextMenu.className = "custom-context-menu";
contextMenu.style.position = "absolute";
contextMenu.style.background = "#fff";
contextMenu.style.border = "1px solid #ccc";
contextMenu.style.padding = "5px";
contextMenu.style.zIndex = 1000;
contextMenu.style.display = "none";
contextMenu.innerHTML = `<button id="delete-context-item">🗑 Supprimer</button>`;
document.body.appendChild(contextMenu);

let rightClickedTarget = null;

//  FONCTIONNALITÉ 6 : Suppression contextuelle des nœuds ou liens
// Un menu contextuel s’affiche lors du clic droit sur un nœud ou un lien.
// L’utilisateur peut alors supprimer l’élément ciblé, ce qui met à jour dynamiquement l’état du réseau.


canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const target = e.target.closest(".network-node, .link-line");
  if (!target) return;
  rightClickedTarget = target;
  contextMenu.style.left = `${e.pageX}px`;
  contextMenu.style.top = `${e.pageY}px`;
  contextMenu.style.display = "block";
});

document.addEventListener("click", () => {
  contextMenu.style.display = "none";
  rightClickedTarget = null;
});

document.getElementById("delete-context-item").addEventListener("click", () => {
  if (!rightClickedTarget) return;

  if (rightClickedTarget.classList.contains("network-node")) {
    const id = rightClickedTarget.dataset.id;
    state.links = state.links.filter(link => link.from !== id && link.to !== id);
    delete state.nodeInfo[id];
    rightClickedTarget.remove();
  }

  if (rightClickedTarget.classList.contains("link-line")) {
    const index = Array.from(document.querySelectorAll(".link-line")).indexOf(rightClickedTarget);
    if (index >= 0) {
      const link = state.links[index];
      const fromNode = state.nodeInfo[link.from];
      const toNode = state.nodeInfo[link.to];
  
      const isDevice = type => ["pc", "laptop", "smartphone", "printer"].includes(type);
  
      // Réinitialiser les infos des appareils connectés
      [link.from, link.to].forEach(id => {
        const node = state.nodeInfo[id];
        if (node && isDevice(node.type)) {
          node.ip = "";
          node.signal = "";
          node.speed = "";
          node.startTime = null;
          updateTooltip(document.querySelector(`[data-id="${id}"]`));
        }
      });
  
      state.links.splice(index, 1);
      rightClickedTarget.remove();
    }
  }
  

  redrawLinks();
  saveNetworkState();
  contextMenu.style.display = "none";
});

});


document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const canvas = document.getElementById("canvas-area");
  const toggleBtn = document.getElementById("toggle_sidebar");

  toggleBtn.addEventListener("click", () => {
    const isHidden = sidebar.classList.toggle("hidden");
    canvas.classList.toggle("full-width", isHidden);
    toggleBtn.textContent = isHidden ? "➡ Afficher" : "⬅ Masquer";
  });
});

//  FONCTIONNALITÉ 8 : Export JSON 
// Permet à l’utilisateur d’exporter la topologie du réseau :
// - en JSON (données techniques)

document.getElementById("export-json").addEventListener("click", () => {
  const data = {
    nodes: Array.from(document.querySelectorAll('.network-node')).map(n => ({
      id: n.dataset.id,
      type: n.dataset.type,
      left: n.style.left,
      top: n.style.top,
      label: n.querySelector('.node-label').textContent
    })),
    links: state.links,
    nodeInfo: state.nodeInfo,
    ipAllocations: state.ipAllocations,
    typeCounters: state.typeCounters
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "topologie_reseau.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});


//  FONCTIONNALITÉ 8 : Export  PDF
// Permet à l’utilisateur d’exporter la topologie du réseau :
// - en PDF (capture visuelle du canvas).

document.getElementById("export-pdf").addEventListener("click", () => {
  html2canvas(document.getElementById("canvas-area")).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("landscape", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

    pdf.addImage(imgData, "PNG", 20, 20, imgWidth * ratio, imgHeight * ratio);
    pdf.save("topologie_reseau.pdf");
  });
  
});

//  FONCTIONNALITÉ 9 : Interface dynamique avec sidebar masquable
// L’utilisateur peut cacher/afficher la barre latérale contenant les équipements
// pour agrandir l’espace de travail sur le canvas.

document.getElementById("toggle-sidebar").addEventListener("click", function () {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("collapsed");

  const isHidden = sidebar.classList.contains("collapsed");
  this.textContent = isHidden ? "▶ Afficher le menu" : "◀ Masquer le menu";
});






