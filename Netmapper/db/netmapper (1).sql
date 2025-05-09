-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 09 mai 2025 à 17:33
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `netmapper`
--

-- --------------------------------------------------------

--
-- Structure de la table `appareils`
--

CREATE TABLE `appareils` (
  `id` int(11) NOT NULL,
  `id_point_acces` int(11) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `adresse_ip` varchar(45) NOT NULL,
  `date_connexion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `points_acces`
--

CREATE TABLE `points_acces` (
  `id` int(11) NOT NULL,
  `id_reseau` int(11) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `canal` int(11) NOT NULL,
  `position_x` int(11) NOT NULL,
  `position_y` int(11) NOT NULL,
  `etat` enum('normal','surcharge','hors-service') DEFAULT 'normal'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reseaux`
--

CREATE TABLE `reseaux` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `date_creation` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_creation` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `email`, `mot_de_passe`, `date_creation`) VALUES
(1, 'issa', 'issa@gmail.com', '$2y$10$079ESk48x18nU2AOxl4WyudGJFgrclibKs2iDEhUc2kXXDKW/LAda', '2025-05-08 15:00:01'),
(2, 'test', 'test@gmail.com', '$2y$10$wi5dnoWdgS9R32j.m.msBOtDhxjqIifbox4kNtleLMBhUpxuOXO0a', '2025-05-08 16:02:47'),
(3, 'test1', 'test1@gmail.com', '$2y$10$WehT1vysNEEK7m1rXE4XwOWu.iXKQOcLePtuuUJYB13JR5AwkRcnG', '2025-05-08 16:07:26'),
(4, 'petit', 'petit@gmail.com', '$2y$10$RyMzjN2uz80jjyLqBwWZOe5Fr7L2nGbummmTdM6z61OOwI0r1S4Su', '2025-05-08 17:35:22'),
(5, 'mansour', 'mansour@gmail.com', '$2y$10$S8K5EvYGJdyGSNpsOZR7EeQ988uEPQbJ6LfaOqHPJ0jXegIWNcofS', '2025-05-09 11:04:58');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `appareils`
--
ALTER TABLE `appareils`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_point_acces` (`id_point_acces`);

--
-- Index pour la table `points_acces`
--
ALTER TABLE `points_acces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_reseau` (`id_reseau`);

--
-- Index pour la table `reseaux`
--
ALTER TABLE `reseaux`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `appareils`
--
ALTER TABLE `appareils`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `points_acces`
--
ALTER TABLE `points_acces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reseaux`
--
ALTER TABLE `reseaux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `appareils`
--
ALTER TABLE `appareils`
  ADD CONSTRAINT `appareils_ibfk_1` FOREIGN KEY (`id_point_acces`) REFERENCES `points_acces` (`id`);

--
-- Contraintes pour la table `points_acces`
--
ALTER TABLE `points_acces`
  ADD CONSTRAINT `points_acces_ibfk_1` FOREIGN KEY (`id_reseau`) REFERENCES `reseaux` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
