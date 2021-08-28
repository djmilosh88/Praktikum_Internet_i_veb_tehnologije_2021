-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.4-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for aplikacija
DROP DATABASE IF EXISTS `aplikacija`;
CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `aplikacija`;

-- Dumping structure for table aplikacija.administrtor
DROP TABLE IF EXISTS `administrtor`;
CREATE TABLE IF NOT EXISTS `administrtor` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table aplikacija.article
DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `article_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`article_id`),
  UNIQUE KEY `uq_article_title` (`title`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `fk_category_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table aplikacija.cart
DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `fk_cart_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table aplikacija.cart_article
DROP TABLE IF EXISTS `cart_article`;
CREATE TABLE IF NOT EXISTS `cart_article` (
  `cart_article_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quantity` int(10) unsigned NOT NULL,
  `cart_id` int(10) unsigned NOT NULL,
  `article_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`cart_article_id`),
  UNIQUE KEY `uq_cart_article_cart_id_article_id` (`cart_id`,`article_id`),
  KEY `fa_cart_article_article_id` (`article_id`),
  CONSTRAINT `fa_cart_article_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_article_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table aplikacija.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table aplikacija.order
DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `status` enum('pending','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `cart_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uq_order_cart_id` (`cart_id`),
  CONSTRAINT `fk_order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table aplikacija.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `forename` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
