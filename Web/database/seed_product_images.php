<?php

declare(strict_types=1);

require_once __DIR__ . '/../backend/config/database.php';

$images = [
    1 => 'https://loremflickr.com/800/800/white,linen,shirt/all?lock=2001',
    2 => 'https://loremflickr.com/800/800/blue,jeans/all?lock=2002',
    3 => 'https://loremflickr.com/800/800/floral,dress/all?lock=2003',
    4 => 'https://loremflickr.com/800/800/brown,leather,bag/all?lock=2004',
    5 => 'https://loremflickr.com/800/800/plaid,blazer/all?lock=2005',
    6 => 'https://loremflickr.com/800/800/oxford,shoes/all?lock=2006',
    7 => 'https://loremflickr.com/800/800/pleated,skirt/all?lock=2007',
    8 => 'https://loremflickr.com/800/800/square,wristwatch/all?lock=2008',
    101 => 'https://loremflickr.com/800/800/cream,tshirt/all?lock=2101',
    102 => 'https://loremflickr.com/800/800/black,graphic,tshirt/all?lock=2102',
    103 => 'https://loremflickr.com/800/800/plaid,flannel,shirt/all?lock=2103',
    104 => 'https://loremflickr.com/800/800/blue,linen,shirt/all?lock=2104',
    105 => 'https://loremflickr.com/800/800/denim,jacket/all?lock=2105',
    106 => 'https://loremflickr.com/800/800/charcoal,blazer/all?lock=2106',
    107 => 'https://loremflickr.com/800/800/light,blue,jeans/all?lock=2107',
    108 => 'https://loremflickr.com/800/800/beige,chinos/all?lock=2108',
    109 => 'https://loremflickr.com/800/800/floral,dress/all?lock=2109',
    110 => 'https://loremflickr.com/800/800/black,pleated,skirt/all?lock=2110',
    111 => 'https://loremflickr.com/800/800/canvas,tote,bag/all?lock=2111',
    112 => 'https://loremflickr.com/800/800/brown,leather,bag/all?lock=2112',
    113 => 'https://loremflickr.com/800/800/white,sneakers/all?lock=2113',
    114 => 'https://loremflickr.com/800/800/brown,leather,belt/all?lock=2114',
];

$db = Database::connection();
$stmt = $db->prepare('UPDATE `Product` SET `ProductImage` = ? WHERE `ProductID` = ?');

foreach ($images as $productId => $image) {
    $stmt->execute([$image, $productId]);
}

echo 'Updated product images: ' . count($images) . PHP_EOL;
