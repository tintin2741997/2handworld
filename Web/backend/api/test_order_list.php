<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/orders';
session_start();
require_once __DIR__ . '/../config/database.php';
$db = Database::connection();
$stmt = $db->query("SELECT UserID FROM Users WHERE Role = 'buyer' AND Email = 'nguyenvana@gmail.com' LIMIT 1");
$buyerId = $stmt->fetchColumn();
$_SESSION['user_id'] = $buyerId;
$_SESSION['role'] = 'buyer';

ob_start();
require __DIR__ . '/index.php';
$output = ob_get_clean();
echo $output;
