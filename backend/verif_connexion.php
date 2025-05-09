<?php
session_start();
require_once "ConnexionBD.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = trim($_POST["nom"]);
    $email = trim($_POST["email"]);
    $mot_de_passe = $_POST["mot_de_passe"];

    $pdo = ConnexionBD::getPDO(); // ✅ Appel correct à ta connexion POO

    $stmt = $pdo->prepare("SELECT * FROM utilisateur WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($mot_de_passe, $user["mot_de_passe"])) {
        $_SESSION["utilisateur_id"] = $user["id"];
        $_SESSION["nom_utilisateur"] = $user["nom"];
        header("Location:../Netmapper/index.php");
        exit();
    } else {
        echo "Email ou mot de passe incorrect.";
    }
}
