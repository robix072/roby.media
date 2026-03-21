<?php
/**
 * DATABASE CONFIGURATION FOR SPACESHIP
 * Path: /api/db.php
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// cPanel / MySQL Setup
$host = 'localhost';
$db   = 'roby_media_admin';  // Change based on cPanel database name
$user = 'roby_admin_user';   // Change based on cPanel username
$pass = 'your_password_here';// Database user password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     http_response_code(500);
     echo json_encode(['error' => 'DATABASE_CONNECTION_ERROR', 'details' => $e->getMessage()]);
     exit;
}
?>
