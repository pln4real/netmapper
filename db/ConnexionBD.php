<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "netmapper";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname",$username,$password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $erreur){
    echo"la connexion a echoue : ". $erreur->getMessage();

}

?>