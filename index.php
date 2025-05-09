<?php
session_start();
if (!isset($_SESSION["utilisateur_id"])) {
    header("Location: inscription.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>NetMapper</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/i8-icon@0.9.4/i8-icon.min.css">
</head>
<body>
  

 <!-- 🔘 Bouton pour afficher/masquer la sidebar -->
 <button id="toggle_sidebar"
    
  >⬅ Masquer</button>



<aside class="sidebar" id="custom-sidebar">
  <div class="user-info">
    <i class="fas fa-user-circle"></i>
    <h3>Bienvenue, <?php echo htmlspecialchars($_SESSION["nom_utilisateur"]); ?></h3>
  </div>

  <div class="sidebar-content" id="sidebar-scroll">
    <div class="section">
      <h3 class="dropdown-header" onclick="toggleMenu('devices-list')">
        <i class="fas fa-laptop-house"></i> Appareils
        <i class="fas fa-chevron-down"></i>
      </h3>
      <ul class="dropdown-list" id="devices-list">
        <li draggable="true" data-type="pc"><i class="fas fa-desktop"></i> PC</li>
        <li draggable="true" data-type="laptop"><i class="fas fa-laptop"></i> Laptop</li>
        <li draggable="true" data-type="smartphone"><i class="fas fa-mobile-alt"></i> Smartphone</li>
        <li draggable="true" data-type="printer"><i class="fas fa-print"></i> Imprimante</li>
      </ul>
    </div>

    <div class="section">
      <h3 class="dropdown-header" onclick="toggleMenu('wifi-list')">
        <i class="fas fa-network-wired"></i> Réseau
        <i class="fas fa-chevron-down"></i>
      </h3>
      <ul class="dropdown-list" id="wifi-list">
        <li draggable="true" data-type="wifi"><i class="fas fa-wifi"></i> Réseau Wi-Fi</li>
        <li draggable="true" data-type="routeur"><i class="fas fa-broadcast-tower"></i> Routeur</li>
        <li draggable="true" data-type="switch"><i class="fas fa-ethernet"></i> Switch</li>
      </ul>
    </div>

    <div class="section">
      <button id="export-json" class="sidebar-btn">📁 Exporter la config JSON</button>
      <button id="export-pdf" class="sidebar-btn">🖨️ Exporter la topologie PDF</button>
      <button id="reset-topology" class="sidebar-btn danger">🗑️ Réinitialiser la topologie</button>
      <a href="../backend/logout.php" class="sidebar-btn logout">🚪 Se déconnecter</a>
      <button id="simulate-network" class="sidebar-btn">📡 Simuler</button>

    </div>
  </div>


</aside>




  <main class="canvas-area" id="canvas-area"></main>
  <script src="script.js"></script>
  <script type="module" src="main.js"></script>

  <script src="https://cdn.jsdelivr.net/npm/i8-icon@0.9.4/index.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
  const simulateBtn = document.getElementById("simulate-network");
  if (!simulateBtn) return;

  simulateBtn.addEventListener("click", () => {
    const wifiId = Object.keys(state.nodeInfo).find(id => state.nodeInfo[id].type === "wifi");
    if (!wifiId) return;

    const visited = new Set();
    const queue = [wifiId];
    const canvas = document.getElementById("canvas-area");

    visited.add(wifiId);

    while (queue.length > 0) {
      const currentId = queue.shift();
      const currentNode = document.querySelector(`[data-id="${currentId}"]`);
      if (!currentNode) continue;

      const currentX = currentNode.offsetLeft + currentNode.offsetWidth / 2;
      const currentY = currentNode.offsetTop + currentNode.offsetHeight / 2;

      const neighbors = state.links
        .filter(link => link.from === currentId || link.to === currentId)
        .map(link => (link.from === currentId ? link.to : link.from))
        .filter(id => !visited.has(id));

      neighbors.forEach(neighborId => {
        visited.add(neighborId);
        queue.push(neighborId);

        const neighborNode = document.querySelector(`[data-id="${neighborId}"]`);
        if (!neighborNode) return;

        // ✅ Affichage d'une animation visuelle de réception
        neighborNode.classList.add("node-receive");
        setTimeout(() => neighborNode.classList.remove("node-receive"), 600);

        // Effet de propagation visuelle
        const toX = neighborNode.offsetLeft + neighborNode.offsetWidth / 2;
        const toY = neighborNode.offsetTop + neighborNode.offsetHeight / 2;

        const ping = document.createElement("div");
        ping.className = "ping-animation";
        ping.style.left = `${currentX}px`;
        ping.style.top = `${currentY}px`;
        canvas.appendChild(ping);

        ping.animate([
          { transform: `translate(0px, 0px) scale(1)`, opacity: 1 },
          { transform: `translate(${toX - currentX}px, ${toY - currentY}px) scale(1.5)`, opacity: 0 }
        ], {
          duration: 800,
          easing: "ease-out"
        });

        setTimeout(() => ping.remove(), 800);
      });
    }
  });
});

</script>


</body>
</html>
