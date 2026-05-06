<?php
$hash = '$2y$10$gkGFJH/ZS45sC/SrnKQ9SO.s.06sIwXhfkaI7Vr9VAfMF16r5aFly';
echo "admin123: " . (password_verify('admin123', $hash) ? 'YES' : 'NO') . "\n";
echo "123456: " . (password_verify('123456', $hash) ? 'YES' : 'NO') . "\n";
echo "admin: " . (password_verify('admin', $hash) ? 'YES' : 'NO') . "\n";

$hash2 = '$2y$10$5S4gaFEj4JIlM5tdSmXuS.pkDY0RTyKU/R43luq/0u9FX3NVRs76a';
echo "buyer 123456: " . (password_verify('123456', $hash2) ? 'YES' : 'NO') . "\n";
