<?php

declare(strict_types=1);

require_once __DIR__ . '/../backend/config/database.php';

$db = Database::connection();
$db->beginTransaction();

try {
    $categories = [
        1 => 'Áo',
        2 => 'Quần',
        3 => 'Váy/Đầm',
        4 => 'Giày dép',
        5 => 'Túi xách',
        6 => 'Phụ kiện',
        101 => 'Áo thun secondhand',
        102 => 'Áo sơ mi vintage',
        103 => 'Áo khoác',
    ];

    $categoryStmt = $db->prepare(
        'INSERT IGNORE INTO `Category` (`CategoryID`, `CategoryName`) VALUES (?, ?)'
    );

    foreach ($categories as $id => $name) {
        $categoryStmt->execute([$id, $name]);
    }

    $products = [
        [1, 1, 'Áo Sơ Mi Linen Trắng Vintage', 'https://loremflickr.com/800/800/white,linen,shirt/all?lock=2001', 250000, 90000, 'Áo sơ mi linen chất liệu thoáng mát, phong cách vintage thanh lịch.', 'Như mới', 0, 'active', 40],
        [2, 2, 'Quần Jeans Levis 501 Xanh Đậm', 'https://loremflickr.com/800/800/blue,jeans/all?lock=2002', 350000, 180000, 'Quần jeans Levis chính hãng, độ mới khoảng 90%, form đứng.', 'Tốt', 0, 'active', 0],
        [3, 3, 'Đầm Hoa Nhí Dáng Dài Mùa Thu', 'https://loremflickr.com/800/800/floral,dress/all?lock=2003', 220000, 100000, 'Đầm hoa nhí phong cách Hàn Quốc, chất voan lụa mềm mại.', 'Như mới', 0, 'active', 18],
        [4, 5, 'Túi Xách Da Thật Đeo Chéo Retro', 'https://loremflickr.com/800/800/brown,leather,bag/all?lock=2004', 450000, 240000, 'Túi xách da thật màu nâu bò vintage, phụ kiện đồng thau.', 'Khá', 0, 'active', 0],
        [5, 1, 'Áo Khoác Blazer Kẻ Caro Oversize', 'https://loremflickr.com/800/800/plaid,blazer/all?lock=2005', 300000, 140000, 'Blazer form rộng phong cách menswear, họa tiết kẻ caro.', 'Tốt', 0, 'active', 26],
        [6, 4, 'Giày Oxford Da Nữ Cổ Điển', 'https://loremflickr.com/800/800/oxford,shoes/all?lock=2006', 280000, 120000, 'Giày oxford da màu nâu đậm, size 37, đã vệ sinh và đánh xi.', 'Trung bình', 0, 'active', 0],
        [7, 3, 'Chân Váy Midi Xếp Ly Màu Be', 'https://loremflickr.com/800/800/pleated,skirt/all?lock=2007', 120000, 50000, 'Chân váy xếp ly dáng dài qua gối, cạp chun co giãn thoải mái.', 'Như mới', 0, 'active', 0],
        [8, 6, 'Đồng Hồ Dây Da Mặt Vuông Vintage', 'https://loremflickr.com/800/800/square,wristwatch/all?lock=2008', 400000, 210000, 'Đồng hồ nữ mặt vuông, máy quartz chạy chuẩn giờ.', 'Tốt', 0, 'active', 20],
        [101, 101, 'Áo thun basic Uniqlo màu kem', 'https://loremflickr.com/800/800/cream,tshirt/all?lock=2101', 120000, 55000, 'Áo thun cotton mềm, form regular, dễ phối đồ hằng ngày.', 'Như mới', 3, 'active', 0],
        [102, 101, 'Áo thun graphic vintage đen', 'https://loremflickr.com/800/800/black,graphic,tshirt/all?lock=2102', 150000, 65000, 'Áo thun in graphic phong cách retro, chất vải dày vừa.', 'Tốt', 5, 'active', 10],
        [103, 102, 'Sơ mi caro flannel nâu đỏ', 'https://loremflickr.com/800/800/plaid,flannel,shirt/all?lock=2103', 210000, 95000, 'Sơ mi flannel dày dặn, hợp mặc khoác ngoài hoặc layer.', 'Tốt', 2, 'active', 0],
        [104, 102, 'Sơ mi linen xanh pastel', 'https://loremflickr.com/800/800/blue,linen,shirt/all?lock=2104', 240000, 110000, 'Sơ mi linen thoáng mát, màu xanh dịu, phù hợp đi học đi làm.', 'Như mới', 1, 'active', 15],
        [105, 103, 'Áo khoác denim xanh washed', 'https://loremflickr.com/800/800/denim,jacket/all?lock=2105', 390000, 210000, 'Áo khoác denim dáng rộng, màu wash đẹp, còn cứng form.', 'Tốt', 4, 'active', 0],
        [106, 103, 'Blazer oversize màu than', 'https://loremflickr.com/800/800/charcoal,blazer/all?lock=2106', 360000, 170000, 'Blazer oversize tối giản, dễ phối với quần jeans hoặc váy.', 'Khá', 1, 'active', 20],
        [107, 2, 'Quần jeans ống đứng xanh nhạt', 'https://loremflickr.com/800/800/light,blue,jeans/all?lock=2107', 320000, 160000, 'Jeans ống đứng cạp vừa, màu xanh nhạt, không lỗi vải.', 'Tốt', 6, 'active', 0],
        [108, 2, 'Quần kaki be vintage', 'https://loremflickr.com/800/800/beige,chinos/all?lock=2108', 260000, 120000, 'Quần kaki màu be, form suông, phong cách vintage nhẹ nhàng.', 'Như mới', 2, 'active', 12],
        [109, 3, 'Đầm hoa nhí cổ vuông', 'https://loremflickr.com/800/800/floral,dress/all?lock=2109', 280000, 130000, 'Đầm hoa nhí cổ vuông, dáng xòe nhẹ, chất vải mềm.', 'Như mới', 3, 'active', 0],
        [110, 3, 'Chân váy midi đen xếp ly', 'https://loremflickr.com/800/800/black,pleated,skirt/all?lock=2110', 180000, 80000, 'Chân váy midi xếp ly màu đen, dễ phối áo sơ mi và áo thun.', 'Tốt', 4, 'active', 5],
        [111, 5, 'Túi tote canvas thêu logo', 'https://loremflickr.com/800/800/canvas,tote,bag/all?lock=2111', 140000, 60000, 'Túi tote canvas dày, có khóa bấm, dùng đi học hoặc đi chợ.', 'Như mới', 7, 'active', 0],
        [112, 5, 'Túi da đeo vai màu nâu', 'https://loremflickr.com/800/800/brown,leather,bag/all?lock=2112', 420000, 230000, 'Túi da đeo vai màu nâu vintage, phụ kiện kim loại còn sáng.', 'Khá', 2, 'active', 18],
        [113, 4, 'Giày sneaker trắng tối giản', 'https://loremflickr.com/800/800/white,sneakers/all?lock=2113', 300000, 150000, 'Sneaker trắng đã vệ sinh, size 38, đế còn tốt.', 'Tốt', 3, 'active', 0],
        [114, 6, 'Thắt lưng da nâu cổ điển', 'https://loremflickr.com/800/800/brown,leather,belt/all?lock=2114', 160000, 70000, 'Thắt lưng da nâu bản vừa, khóa kim loại phong cách cổ điển.', 'Tốt', 5, 'active', 0],
    ];

    $productStmt = $db->prepare(
        'INSERT IGNORE INTO `Product`
         (`ProductID`, `CategoryID`, `ProductName`, `ProductImage`, `Price`, `ImportPrice`, `Description`, `Condition`, `SoldQuantity`, `ProductStatus`, `DiscountPercent`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );

    foreach ($products as $product) {
        $productStmt->execute($product);
    }

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

    $imageStmt = $db->prepare(
        'UPDATE `Product`
         SET `ProductImage` = ?
         WHERE `ProductID` = ? AND (`ProductImage` IS NULL OR `ProductImage` = "")'
    );

    foreach ($images as $productId => $image) {
        $imageStmt->execute([$image, $productId]);
    }

    $reviews = [
        [101, 2, 5, 'Áo mềm, màu ngoài đẹp hơn ảnh, rất dễ mặc.'],
        [105, 3, 5, 'Áo denim còn form tốt, phối đồ rất ổn.'],
        [109, 2, 4, 'Đầm xinh, đúng mô tả, giao hàng cẩn thận.'],
        [112, 3, 5, 'Túi da đẹp, hợp phong cách vintage.'],
        [113, 2, 4, 'Giày sạch, còn dùng tốt so với giá.'],
    ];

    $reviewStmt = $db->prepare(
        'UPDATE `Review` SET `Comment` = ? WHERE `ProductID` = ? AND `UserID` = ? AND `Rating` = ?'
    );

    foreach ($reviews as [$productId, $userId, $rating, $comment]) {
        $reviewStmt->execute([$comment, $productId, $userId, $rating]);
    }

    $db->commit();
    echo "Seeded Vietnamese catalog data successfully.\n";
} catch (Throwable $exception) {
    $db->rollBack();
    fwrite(STDERR, $exception->getMessage() . PHP_EOL);
    exit(1);
}
