#Projet4

Fonctionnalités de l'application de topologie réseau interactive


1. Ajout d'équipements réseau (nœuds)
• Ajout par glisser-déposer depuis une barre latérale (PC, laptop, smartphone, imprimante, Wi-Fi, routeur, switch).
• Positionnement libre des équipements sur le canvas.


2. Attribution automatique d'adresses
• Adresse MAC générée automatiquement.
• Adresse IP attribuée automatiquement (ou manuellement pour Wi-Fi).
• Masque réseau par défaut : 255.255.255.0.


3. Création de liens entre nœuds
• Cliquez sur deux équipements pour les relier.
• Règles métier : pas de liaison entre deux clients (ex : PC ↔ imprimante).
• Lien coloré selon le type de charge (Wi-Fi) ou de liaison (gris pour switch/routeur).


4. Mesure de signal et débit Wi-Fi
• Signal calculé selon la distance au Wi-Fi.
• Qualité : Bonne (≤150px), Moyenne (≤300px), Faible (>300px).
• Débit associé : 100 Mbps, 50 Mbps, 10 Mbps.


5. Édition des noms des nœuds
• Double-clic sur un nœud : modification de son nom via un champ de texte.


6. Suppression via clic droit
• Menu contextuel : suppression de nœud ou de lien.
• Réinitialisation automatique des données de l’appareil après suppression d’un lien.


7. Sauvegarde & chargement automatique
• Sauvegarde automatique dans le localStorage du navigateur.
• Chargement automatique au redémarrage.


8. Export de la topologie
• Export JSON : données détaillées.
• Export PDF : vue graphique de la topologie via html2canvas.


9. Interface utilisateur dynamique
• Sidebar masquable pour plus d'espace sur le canvas.
• Badge de compteur de connexions sur le Wi-Fi avec couleurs (vert, orange, rouge).


10. Redessin dynamique des liens
• Mise à jour des lignes de connexion lors du déplacement des nœuds.

