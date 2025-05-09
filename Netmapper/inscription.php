<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Inscription</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link rel="stylesheet" href="inscription.css">
  <style>


  </style>
    
  </style>
</head>
<body>
  <div class="container">
    <h2>Créer un compte</h2>
    <form method="POST" action="../backend/verif_inscription.php">
      <input type="text" name="nom" placeholder="Votre nom" required>
      <input type="email" name="email" placeholder="Votre email" required>
      <input type="password" name="mot_de_passe" placeholder="Mot de passe" required>
      <button type="submit">S'inscrire</button>
     <a href="../backend/formulaireCon.php"> Se Connecter</a>
    </form>
  </div>
</body>

</html>
