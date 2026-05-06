<?php
require_once __DIR__ . '/../config/database.php';
try {
    $db = Database::connection();
    echo "Orders: " . $db->query('SELECT COUNT(*) FROM `Order`')->fetchColumn() . "\n";
    echo "Reviews: " . $db->query('SELECT COUNT(*) FROM `Review`')->fetchColumn() . "\n";
    echo "Users: " . $db->query('SELECT COUNT(*) FROM `Users`')->fetchColumn() . "\n";
    echo "Products: " . $db->query('SELECT COUNT(*) FROM `Product`')->fetchColumn() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
