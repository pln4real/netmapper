<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Connexion NetMapper</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: white;
    }
    .container {
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 40px;
      padding: 60px 40px;
    }
    .login-box, .social-box {
      width: 400px;
      height: 360px;
      border-radius: 15px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      padding: 30px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .login-box {
      background-color: #ffffff;
    }
    .login-box h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    input[type="text"], input[type="email"] {
      width: 100%;
      padding: 12px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .login-box button {
      width: 100%;
      background-color: #005eff;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }
    .login-box button:hover {
      background-color: #0041bb;
    }

    .social-box {
      background-color: #111;
      color: white;
    }
    .social-box h3 {
      text-align: center;
      margin-bottom: 20px;
    }
    .social-links {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex-grow: 1;
    }
    .social-link {
      display: flex;
      align-items: center;
      font-size: 18px;
      margin: 10px 0;
    }
    .social-link i {
      margin-right: 10px;
      font-size: 22px;
    }
    .social-link a {
      color: white;
      text-decoration: none;
    }
    .social-link a:hover {
      text-decoration: underline;
    }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
  <div class="container">
    <div class="login-box">
      <h2>Connexion pour accéder à NetMapper</h2>
      <form>
        <label for="nom">Nom</label>
        <input type="text" id="nom" name="nom" placeholder="Votre nom..." required>

        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" placeholder="Votre email..." required>

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
