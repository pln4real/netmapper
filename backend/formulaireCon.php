<?php
session_start();
// Si déjà connecté, redirige vers l'application
if (isset($_SESSION["utilisateur_id"])) {
    header("Location:index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link rel="stylesheet" href="../Netmapper/style.css">
  <title>Connexion NetMapper</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
  <div class="container">
    <div class="login-box">
      <h2>Connexion à NetMapper</h2>
      <form method="POST" action="verif_connexion.php">
        <label for="nom">Nom</label>
        <input type="text" id="nom" name="nom" placeholder="Votre nom..." required>

        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" placeholder="Votre email..." required>

        <label for="mot_de_passe">Mot de passe</label>
        <input type="password" id="mot_de_passe" name="mot_de_passe" placeholder="Votre mot de passe..." required>

        <button type="submit">Se connecter</button>
      </form>
    </div>

    <div class="social-box">
      <h3>NOS RÉSEAUX SOCIAUX</h3>
      <div class="social-links">
        <div class="social-link"><i class="fab fa-facebook"></i><a href="#">Facebook</a></div>
        <div class="social-link"><i class="fab fa-twitter"></i><a href="#">Twitter</a></div>
        <div class="social-link"><i class="fab fa-instagram"></i><a href="#">Instagram</a></div>
        <div class="social-link"><i class="fab fa-google-plus-g"></i><a href="#">Google+</a></div>
      </div>
    </div>
  </div>
</body>
</html>
