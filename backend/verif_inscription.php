<?php
require_once "ConnexionBD.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $pdo = ConnexionBD::getPDO();

    $nom = trim($_POST["nom"]);
    $email = trim($_POST["email"]);
    $mot_de_passe = password_hash($_POST["mot_de_passe"], PASSWORD_DEFAULT);

    // Vérifie si l'email existe déjà
    $check = $pdo->prepare("SELECT id FROM utilisateur WHERE email = ?");
    $check->execute([$email]);

    if ($check->fetch()) {
        echo "❌ Cet email est déjà utilisé. <a href='inscription.php'>Retour</a>";
        exit();
    }

    // Insère l'utilisateur
    $stmt = $pdo->prepare("INSERT INTO utilisateur (nom, email, mot_de_passe) VALUES (?, ?, ?)");
    if ($stmt->execute([$nom, $email, $mot_de_passe])) {
        header("Location: formulaireCon.php");
        exit();
    } else {
        echo "❌ Erreur à l'inscription.";
    }
}
?>
