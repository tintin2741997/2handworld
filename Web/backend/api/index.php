<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

session_start();

header('Content-Type: application/json; charset=utf-8');
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
$allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function db(): PDO
{
    return Database::connection();
}

function json_response(mixed $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function error_response(string $message, int $status = 400, array $details = []): void
{
    json_response(['success' => false, 'message' => $message, 'details' => $details], $status);
}

function body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return $_POST;
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        error_response('JSON không hợp lệ.', 422);
    }

    return $data;
}

function int_id(mixed $value, string $prefix = ''): int
{
    $value = (string) $value;
    if ($prefix !== '' && str_starts_with($value, $prefix)) {
        $value = substr($value, strlen($prefix));
    }

    $id = filter_var($value, FILTER_VALIDATE_INT);
    if ($id === false || $id <= 0) {
        error_response('Mã dữ liệu không hợp lệ.', 422);
    }

    return (int) $id;
}

function require_fields(array $data, array $fields): void
{
    $missing = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || $data[$field] === '') {
            $missing[] = $field;
        }
    }

    if ($missing !== []) {
        error_response('Thiếu dữ liệu bắt buộc.', 422, ['missing' => $missing]);
    }
}

function current_user_id(): ?int
{
    return isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null;
}

function current_user_role(): ?string
{
    return $_SESSION['role'] ?? null;
}

function require_login(): int
{
    $userId = current_user_id();
    if ($userId === null) {
        error_response('Vui lòng đăng nhập.', 401);
    }

    return $userId;
}

function require_admin(): void
{
    if (current_user_role() !== 'admin') {
        error_response('Bạn không có quyền thực hiện thao tác này.', 403);
    }
}

function slugify(string $text): string
{
    $text = trim(mb_strtolower($text, 'UTF-8'));
    $map = [
        'à' => 'a', 'á' => 'a', 'ạ' => 'a', 'ả' => 'a', 'ã' => 'a', 'â' => 'a', 'ầ' => 'a', 'ấ' => 'a', 'ậ' => 'a', 'ẩ' => 'a', 'ẫ' => 'a', 'ă' => 'a', 'ằ' => 'a', 'ắ' => 'a', 'ặ' => 'a', 'ẳ' => 'a', 'ẵ' => 'a',
        'è' => 'e', 'é' => 'e', 'ẹ' => 'e', 'ẻ' => 'e', 'ẽ' => 'e', 'ê' => 'e', 'ề' => 'e', 'ế' => 'e', 'ệ' => 'e', 'ể' => 'e', 'ễ' => 'e',
        'ì' => 'i', 'í' => 'i', 'ị' => 'i', 'ỉ' => 'i', 'ĩ' => 'i',
        'ò' => 'o', 'ó' => 'o', 'ọ' => 'o', 'ỏ' => 'o', 'õ' => 'o', 'ô' => 'o', 'ồ' => 'o', 'ố' => 'o', 'ộ' => 'o', 'ổ' => 'o', 'ỗ' => 'o', 'ơ' => 'o', 'ờ' => 'o', 'ớ' => 'o', 'ợ' => 'o', 'ở' => 'o', 'ỡ' => 'o',
        'ù' => 'u', 'ú' => 'u', 'ụ' => 'u', 'ủ' => 'u', 'ũ' => 'u', 'ư' => 'u', 'ừ' => 'u', 'ứ' => 'u', 'ự' => 'u', 'ử' => 'u', 'ữ' => 'u',
        'ỳ' => 'y', 'ý' => 'y', 'ỵ' => 'y', 'ỷ' => 'y', 'ỹ' => 'y', 'đ' => 'd',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?: '';
    return trim($text, '-') ?: 'item';
}

function frontend_order_status(string $status): string
{
    return [
        'Chưa xác nhận' => 'pending',
        'Đã xác nhận' => 'confirmed',
        'Đang giao' => 'shipping',
        'Hoàn thành' => 'completed',
        'Đã hủy' => 'cancelled',
        'Giao thất bại' => 'failed_delivery',
        'Đã trả về cửa hàng' => 'returned',
        'Bị từ chối' => 'rejected',
    ][$status] ?? $status;
}

function db_order_status(string $status): string
{
    return [
        'pending' => 'Chưa xác nhận',
        'confirmed' => 'Đã xác nhận',
        'shipping' => 'Đang giao',
        'completed' => 'Hoàn thành',
        'cancelled' => 'Đã hủy',
        'failed_delivery' => 'Giao thất bại',
        'returned' => 'Đã trả về cửa hàng',
        'rejected' => 'Bị từ chối',
    ][$status] ?? $status;
}

function frontend_payment_status(string $status): string
{
    return [
        'Chưa thanh toán' => 'unpaid',
        'Đã thanh toán' => 'paid',
        'Thanh toán thất bại' => 'failed',
        'Đã hoàn tiền' => 'refunded',
    ][$status] ?? $status;
}

function db_payment_status(string $status): string
{
    return [
        'unpaid' => 'Chưa thanh toán',
        'paid' => 'Đã thanh toán',
        'failed' => 'Thanh toán thất bại',
        'refunded' => 'Đã hoàn tiền',
    ][$status] ?? $status;
}

function method_name(string $method): string
{
    return [
        'cod' => 'COD',
        'bank_transfer' => 'Bank',
        'bank' => 'Bank',
        'store' => 'Trực tiếp tại cửa hàng',
    ][$method] ?? $method;
}

function product_row(array $row): array
{
    $price = (int) $row['Price'];
    $discount = (int) ($row['DiscountPercent'] ?? 0);
    $finalPrice = $discount > 0 ? (int) round($price * (100 - $discount) / 100) : $price;
    $image = $row['ProductImage'] ?: 'https://picsum.photos/seed/product' . $row['ProductID'] . '/600/600';

    return [
        'id' => 'p' . $row['ProductID'],
        'name' => $row['ProductName'],
        'price' => $finalPrice,
        'originalPrice' => $discount > 0 ? $price : null,
        'images' => [$image],
        'category' => 'c' . $row['CategoryID'],
        'categoryName' => $row['CategoryName'] ?? null,
        'store' => 'main',
        'condition' => $row['Condition'],
        'description' => $row['Description'] ?? '',
        'stock' => (int) ($row['StockQuantity'] ?? 0),
        'rating' => isset($row['Rating']) ? round((float) $row['Rating'], 1) : 0,
        'reviewCount' => (int) ($row['ReviewCount'] ?? 0),
        'isNew' => strtotime((string) $row['CreatedAt']) >= strtotime('-14 days'),
        'isSale' => $discount > 0,
        'salePercent' => $discount > 0 ? $discount : null,
        'status' => $row['ProductStatus'],
        'createdAt' => $row['CreatedAt'],
        'updatedAt' => $row['UpdatedAt'] ?? null,
    ];
}

function order_row(array $order): array
{
    $stmt = db()->prepare(
        'SELECT od.ProductID, od.Quantity, od.Price, p.ProductName, p.ProductImage, p.`Condition`
         FROM `OrderDetail` od
         JOIN `Product` p ON p.ProductID = od.ProductID
         WHERE od.OrderID = ?'
    );
    $stmt->execute([(int) $order['OrderID']]);
    $items = array_map(static fn(array $item): array => [
        'productId' => 'p' . $item['ProductID'],
        'productName' => $item['ProductName'],
        'productImage' => $item['ProductImage'] ?: 'https://picsum.photos/seed/product' . $item['ProductID'] . '/600/600',
        'price' => (int) $item['Price'],
        'quantity' => (int) $item['Quantity'],
        'condition' => $item['Condition'],
    ], $stmt->fetchAll());

    $payment = db()->prepare(
        'SELECT p.Status, pm.MethodName
         FROM `Payment` p
         JOIN `PaymentMethod` pm ON pm.MethodID = p.MethodID
         WHERE p.OrderID = ?
         LIMIT 1'
    );
    $payment->execute([(int) $order['OrderID']]);
    $paymentRow = $payment->fetch() ?: ['Status' => 'Chưa thanh toán', 'MethodName' => 'COD'];

    return [
        'id' => 'o' . $order['OrderID'],
        'orderNumber' => 'ORD-' . date('Ymd', strtotime((string) $order['OrderDate'])) . '-' . str_pad((string) $order['OrderID'], 4, '0', STR_PAD_LEFT),
        'userId' => $order['UserID'] ? 'u' . $order['UserID'] : null,
        'items' => $items,
        'shippingInfo' => [
            'fullName' => $order['Username'] ?? '',
            'phone' => $order['PhoneNumber'] ?? '',
            'email' => $order['Email'] ?? '',
            'address' => $order['Address'] ?? '',
            'city' => '',
            'district' => '',
            'ward' => '',
            'note' => '',
        ],
        'paymentMethod' => $paymentRow['MethodName'] === 'Bank' ? 'bank_transfer' : strtolower((string) $paymentRow['MethodName']),
        'paymentStatus' => frontend_payment_status((string) $paymentRow['Status']),
        'orderStatus' => frontend_order_status((string) $order['Status']),
        'totalAmount' => (int) $order['TotalAmount'],
        'shippingFee' => max(0, (int) $order['TotalAmount'] - array_sum(array_map(static fn(array $i): int => $i['price'] * $i['quantity'], $items))),
        'note' => '',
        'createdAt' => $order['CreatedAt'],
        'updatedAt' => $order['UpdatedAt'],
    ];
}

function product_list(): void
{
    $where = ['p.ProductStatus != ?'];
    $params = ['hidden'];

    if (isset($_GET['admin']) && $_GET['admin'] === '1') {
        $where = ['1=1'];
        $params = [];
    }
    if (!empty($_GET['search'])) {
        $where[] = 'p.ProductName LIKE ?';
        $params[] = '%' . $_GET['search'] . '%';
    }
    if (!empty($_GET['category'])) {
        $where[] = 'p.CategoryID = ?';
        $params[] = int_id($_GET['category'], 'c');
    }
    if (!empty($_GET['condition'])) {
        $where[] = 'p.`Condition` = ?';
        $params[] = $_GET['condition'];
    }
    if (isset($_GET['sale']) && $_GET['sale'] === '1') {
        $where[] = 'p.DiscountPercent > 0';
    }

    $order = match ($_GET['sort'] ?? 'newest') {
        'price_asc' => 'FinalPrice ASC',
        'price_desc' => 'FinalPrice DESC',
        'oldest' => 'p.CreatedAt ASC',
        default => 'p.CreatedAt DESC',
    };

    $sql = "SELECT p.*, c.CategoryName, COALESCE(i.StockQuantity, 0) AS StockQuantity,
                   CASE WHEN p.DiscountPercent > 0 THEN ROUND(p.Price * (100 - p.DiscountPercent) / 100) ELSE p.Price END AS FinalPrice,
                   AVG(r.Rating) AS Rating, COUNT(r.ReviewID) AS ReviewCount
            FROM `Product` p
            JOIN `Category` c ON c.CategoryID = p.CategoryID
            LEFT JOIN `Inventory` i ON i.ProductID = p.ProductID
            LEFT JOIN `Review` r ON r.ProductID = p.ProductID AND r.Status = 'active'
            WHERE " . implode(' AND ', $where) . "
            GROUP BY p.ProductID
            ORDER BY {$order}";

    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    json_response(['success' => true, 'data' => array_map('product_row', $stmt->fetchAll())]);
}

function product_detail(string $id): void
{
    $stmt = db()->prepare(
        "SELECT p.*, c.CategoryName, COALESCE(i.StockQuantity, 0) AS StockQuantity,
                AVG(r.Rating) AS Rating, COUNT(r.ReviewID) AS ReviewCount
         FROM `Product` p
         JOIN `Category` c ON c.CategoryID = p.CategoryID
         LEFT JOIN `Inventory` i ON i.ProductID = p.ProductID
         LEFT JOIN `Review` r ON r.ProductID = p.ProductID AND r.Status = 'active'
         WHERE p.ProductID = ?
         GROUP BY p.ProductID"
    );
    $stmt->execute([int_id($id, 'p')]);
    $row = $stmt->fetch();
    if (!$row) {
        error_response('Không tìm thấy sản phẩm.', 404);
    }
    json_response(['success' => true, 'data' => product_row($row)]);
}

function product_create(): void
{
    require_admin();
    $data = body();
    require_fields($data, ['name', 'categoryId', 'price', 'importPrice', 'condition']);

    db()->beginTransaction();
    try {
        $stmt = db()->prepare(
            'INSERT INTO `Product` (CategoryID, ProductName, ProductImage, Price, ImportPrice, Description, `Condition`, ProductStatus, DiscountPercent)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            int_id($data['categoryId'], 'c'),
            $data['name'],
            $data['image'] ?? null,
            (int) $data['price'],
            (int) $data['importPrice'],
            $data['description'] ?? null,
            $data['condition'],
            $data['status'] ?? 'active',
            (int) ($data['discountPercent'] ?? 0),
        ]);
        $productId = (int) db()->lastInsertId();
        $stock = (int) ($data['stock'] ?? 0);
        db()->prepare('INSERT INTO `Inventory` (ProductID, StockQuantity, LowStockThreshold) VALUES (?, ?, ?)')
            ->execute([$productId, $stock, (int) ($data['lowStockThreshold'] ?? 5)]);
        if ($stock !== 0) {
            db()->prepare('INSERT INTO `InventoryLog` (ProductID, ChangeQuantity, Reason) VALUES (?, ?, ?)')
                ->execute([$productId, $stock, 'Nhập hàng']);
        }
        db()->commit();
        product_detail((string) $productId);
    } catch (Throwable $exception) {
        db()->rollBack();
        error_response($exception->getMessage(), 500);
    }
}

function product_update(string $id): void
{
    require_admin();
    $productId = int_id($id, 'p');
    $data = body();

    $current = db()->prepare('SELECT Price FROM `Product` WHERE ProductID = ?');
    $current->execute([$productId]);
    $old = $current->fetch();
    if (!$old) {
        error_response('Không tìm thấy sản phẩm.', 404);
    }

    $fields = [];
    $params = [];
    $map = [
        'categoryId' => 'CategoryID',
        'name' => 'ProductName',
        'image' => 'ProductImage',
        'price' => 'Price',
        'importPrice' => 'ImportPrice',
        'description' => 'Description',
        'condition' => '`Condition`',
        'status' => 'ProductStatus',
        'discountPercent' => 'DiscountPercent',
    ];
    foreach ($map as $key => $column) {
        if (array_key_exists($key, $data)) {
            $fields[] = "{$column} = ?";
            $params[] = in_array($key, ['categoryId'], true) ? int_id($data[$key], 'c') : $data[$key];
        }
    }

    if ($fields === []) {
        product_detail((string) $productId);
    }

    $params[] = $productId;
    db()->beginTransaction();
    try {
        db()->prepare('UPDATE `Product` SET ' . implode(', ', $fields) . ' WHERE ProductID = ?')->execute($params);
        if (isset($data['price']) && (int) $old['Price'] !== (int) $data['price']) {
            db()->prepare('INSERT INTO `ProductPriceHistory` (ProductID, OldPrice, NewPrice, ChangedBy) VALUES (?, ?, ?, ?)')
                ->execute([$productId, (int) $old['Price'], (int) $data['price'], current_user_id()]);
        }
        db()->commit();
        product_detail((string) $productId);
    } catch (Throwable $exception) {
        db()->rollBack();
        error_response($exception->getMessage(), 500);
    }
}

function product_delete(string $id): void
{
    require_admin();
    db()->prepare("UPDATE `Product` SET ProductStatus = 'hidden' WHERE ProductID = ?")->execute([int_id($id, 'p')]);
    json_response(['success' => true, 'message' => 'Đã ẩn sản phẩm.']);
}

function category_list(): void
{
    $stmt = db()->query(
        'SELECT c.CategoryID, c.CategoryName, COUNT(p.ProductID) AS ProductCount
         FROM `Category` c
         LEFT JOIN `Product` p ON p.CategoryID = c.CategoryID AND p.ProductStatus != "hidden"
         GROUP BY c.CategoryID
         ORDER BY c.CategoryID'
    );
    $data = array_map(static fn(array $row): array => [
        'id' => 'c' . $row['CategoryID'],
        'name' => $row['CategoryName'],
        'slug' => slugify($row['CategoryName']),
        'icon' => 'BoxIcon',
        'productCount' => (int) $row['ProductCount'],
    ], $stmt->fetchAll());

    json_response(['success' => true, 'data' => $data]);
}

function category_save(?string $id = null): void
{
    require_admin();
    $data = body();
    require_fields($data, ['name']);
    if ($id === null) {
        db()->prepare('INSERT INTO `Category` (CategoryName) VALUES (?)')->execute([$data['name']]);
    } else {
        db()->prepare('UPDATE `Category` SET CategoryName = ? WHERE CategoryID = ?')->execute([$data['name'], int_id($id, 'c')]);
    }
    category_list();
}

function category_delete(string $id): void
{
    require_admin();
    $categoryId = int_id($id, 'c');
    $count = db()->prepare('SELECT COUNT(*) FROM `Product` WHERE CategoryID = ?');
    $count->execute([$categoryId]);
    if ((int) $count->fetchColumn() > 0) {
        error_response('Không thể xóa danh mục đang có sản phẩm.', 409);
    }
    db()->prepare('DELETE FROM `Category` WHERE CategoryID = ?')->execute([$categoryId]);
    category_list();
}

function auth_register(): void
{
    $data = body();
    require_fields($data, ['name', 'email', 'phone', 'password']);
    $stmt = db()->prepare(
        "INSERT INTO `Users` (Username, Email, PhoneNumber, Password, Address, Status, Role)
         VALUES (?, ?, ?, ?, ?, 'Normal', 'buyer')"
    );
    try {
        $stmt->execute([
            $data['name'],
            $data['email'],
            $data['phone'],
            password_hash((string) $data['password'], PASSWORD_DEFAULT),
            $data['address'] ?? null,
        ]);
    } catch (Throwable $exception) {
        error_response('Email hoặc số điện thoại đã tồn tại.', 409);
    }

    $_SESSION['user_id'] = (int) db()->lastInsertId();
    $_SESSION['role'] = 'buyer';
    user_me();
}

function auth_login(): void
{
    $data = body();
    require_fields($data, ['email', 'password']);
    $stmt = db()->prepare('SELECT * FROM `Users` WHERE Email = ? LIMIT 1');
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();
    if (!$user || !password_verify((string) $data['password'], (string) $user['Password'])) {
        error_response('Email hoặc mật khẩu không đúng.', 401);
    }

    $_SESSION['user_id'] = (int) $user['UserID'];
    $_SESSION['role'] = $user['Role'];
    user_me();
}

function user_payload(array $row): array
{
    $stats = db()->prepare(
        "SELECT COUNT(*) AS TotalOrders, COALESCE(SUM(TotalAmount), 0) AS TotalSpent
         FROM `Order`
         WHERE UserID = ? AND Status = 'Hoàn thành'"
    );
    $stats->execute([(int) $row['UserID']]);
    $summary = $stats->fetch() ?: ['TotalOrders' => 0, 'TotalSpent' => 0];

    $blacklist = db()->prepare('SELECT Reason FROM `Blacklist` WHERE UserID = ? OR PhoneNumber = ? ORDER BY CreatedAt DESC LIMIT 1');
    $blacklist->execute([(int) $row['UserID'], $row['PhoneNumber']]);
    $blacklistRow = $blacklist->fetch();

    return [
        'id' => 'u' . $row['UserID'],
        'name' => $row['Username'],
        'email' => $row['Email'],
        'phone' => $row['PhoneNumber'],
        'address' => $row['Address'],
        'status' => strtolower((string) ($row['Status'] ?? 'normal')) === 'blacklist' ? 'blacklisted' : strtolower((string) ($row['Status'] ?? 'normal')),
        'role' => $row['Role'],
        'totalOrders' => (int) $summary['TotalOrders'],
        'totalSpent' => (int) $summary['TotalSpent'],
        'createdAt' => $row['CreatedAt'],
        'blacklistReason' => $blacklistRow['Reason'] ?? null,
    ];
}

function user_me(): void
{
    $userId = require_login();
    $stmt = db()->prepare('SELECT * FROM `Users` WHERE UserID = ?');
    $stmt->execute([$userId]);
    json_response(['success' => true, 'data' => user_payload($stmt->fetch())]);
}

function user_list(): void
{
    require_admin();
    $stmt = db()->query("SELECT * FROM `Users` WHERE Role = 'buyer' ORDER BY CreatedAt DESC");
    json_response(['success' => true, 'data' => array_map('user_payload', $stmt->fetchAll())]);
}

function user_update(?string $id = null): void
{
    $userId = $id ? int_id($id, 'u') : require_login();
    if ($userId !== current_user_id()) {
        require_admin();
    }
    $data = body();
    $fields = [];
    $params = [];
    foreach (['name' => 'Username', 'email' => 'Email', 'phone' => 'PhoneNumber', 'address' => 'Address'] as $key => $column) {
        if (array_key_exists($key, $data)) {
            $fields[] = "{$column} = ?";
            $params[] = $data[$key];
        }
    }
    if (isset($data['password'])) {
        $fields[] = 'Password = ?';
        $params[] = password_hash((string) $data['password'], PASSWORD_DEFAULT);
    }
    if ($fields !== []) {
        $params[] = $userId;
        db()->prepare('UPDATE `Users` SET ' . implode(', ', $fields) . ' WHERE UserID = ?')->execute($params);
    }
    $stmt = db()->prepare('SELECT * FROM `Users` WHERE UserID = ?');
    $stmt->execute([$userId]);
    json_response(['success' => true, 'data' => user_payload($stmt->fetch())]);
}

function user_status(string $id): void
{
    require_admin();
    $data = body();
    require_fields($data, ['status']);
    $status = match ($data['status']) {
        'vip' => 'VIP',
        'blacklisted', 'blacklist' => 'Blacklist',
        default => 'Normal',
    };
    db()->prepare('UPDATE `Users` SET Status = ? WHERE UserID = ? AND Role = "buyer"')->execute([$status, int_id($id, 'u')]);
    json_response(['success' => true]);
}

function blacklist_create(): void
{
    require_admin();
    $data = body();
    require_fields($data, ['reason']);
    $userId = !empty($data['userId']) ? int_id($data['userId'], 'u') : null;
    $phone = $data['phone'] ?? null;
    if ($userId === null && !$phone) {
        error_response('Cần có userId hoặc số điện thoại để blacklist.', 422);
    }
    db()->prepare('INSERT INTO `Blacklist` (UserID, PhoneNumber, Reason) VALUES (?, ?, ?)')->execute([$userId, $phone, $data['reason']]);
    if ($userId !== null) {
        db()->prepare("UPDATE `Users` SET Status = 'Blacklist' WHERE UserID = ?")->execute([$userId]);
    }
    json_response(['success' => true]);
}

function order_create(): void
{
    $data = body();
    require_fields($data, ['items', 'shippingInfo', 'paymentMethod']);
    if (!is_array($data['items']) || $data['items'] === []) {
        error_response('Giỏ hàng đang trống.', 422);
    }

    $shipping = $data['shippingInfo'];
    require_fields($shipping, ['fullName', 'phone', 'address']);

    $blacklist = db()->prepare(
        'SELECT BlacklistID FROM `Blacklist` WHERE PhoneNumber = ? OR UserID = ? LIMIT 1'
    );
    $blacklist->execute([$shipping['phone'], current_user_id()]);
    if ($blacklist->fetch()) {
        error_response('Thông tin đặt hàng đang nằm trong blacklist. Admin cần kiểm tra trước khi xử lý.', 403);
    }

    db()->beginTransaction();
    try {
        $subtotal = 0;
        $orderItems = [];
        foreach ($data['items'] as $item) {
            $productId = int_id($item['productId'] ?? $item['id'] ?? '', 'p');
            $stmt = db()->prepare(
                'SELECT p.ProductID, p.ProductName, p.Price, p.DiscountPercent, i.StockQuantity
                 FROM `Product` p
                 JOIN `Inventory` i ON i.ProductID = p.ProductID
                 WHERE p.ProductID = ? AND p.ProductStatus = "active"
                 FOR UPDATE'
            );
            $stmt->execute([$productId]);
            $product = $stmt->fetch();
            $quantity = (int) ($item['quantity'] ?? 1);
            if (!$product || (int) $product['StockQuantity'] < $quantity) {
                throw new RuntimeException('Sản phẩm không đủ tồn kho: ' . ($item['productName'] ?? $productId));
            }
            $price = (int) round((int) $product['Price'] * (100 - (int) $product['DiscountPercent']) / 100);
            $subtotal += $price * $quantity;
            $orderItems[] = ['id' => $productId, 'quantity' => $quantity, 'price' => $price];
        }

        $shippingFee = (int) ($data['shippingFee'] ?? ($subtotal > 500000 ? 0 : 30000));
        $total = $subtotal + $shippingFee;
        db()->prepare(
            "INSERT INTO `Order` (UserID, TotalAmount, Status, PhoneNumber, Address)
             VALUES (?, ?, 'Chưa xác nhận', ?, ?)"
        )->execute([
            current_user_id(),
            $total,
            $shipping['phone'],
            trim(($shipping['address'] ?? '') . ', ' . ($shipping['ward'] ?? '') . ', ' . ($shipping['district'] ?? '') . ', ' . ($shipping['city'] ?? ''), ' ,'),
        ]);
        $orderId = (int) db()->lastInsertId();

        foreach ($orderItems as $item) {
            db()->prepare('INSERT INTO `OrderDetail` (OrderID, ProductID, Quantity, Price) VALUES (?, ?, ?, ?)')
                ->execute([$orderId, $item['id'], $item['quantity'], $item['price']]);
        }

        $method = method_name((string) $data['paymentMethod']);
        db()->prepare('INSERT IGNORE INTO `PaymentMethod` (MethodName) VALUES (?)')->execute([$method]);
        $methodId = db()->prepare('SELECT MethodID FROM `PaymentMethod` WHERE MethodName = ?');
        $methodId->execute([$method]);
        $methodRow = $methodId->fetch();
        db()->prepare("INSERT INTO `Payment` (OrderID, MethodID, Status, PaymentDate) VALUES (?, ?, 'Chưa thanh toán', NULL)")
            ->execute([$orderId, (int) $methodRow['MethodID']]);

        db()->commit();

        $created = db()->prepare(
            'SELECT o.*, u.Username, u.Email
             FROM `Order` o
             LEFT JOIN `Users` u ON u.UserID = o.UserID
             WHERE o.OrderID = ?'
        );
        $created->execute([$orderId]);
        json_response(['success' => true, 'data' => order_row($created->fetch())], 201);
    } catch (Throwable $exception) {
        db()->rollBack();
        error_response($exception->getMessage(), 422);
    }
}

function order_list(): void
{
    $params = [];
    $where = [];
    if (current_user_role() !== 'admin') {
        $where[] = 'o.UserID = ?';
        $params[] = require_login();
    }
    if (!empty($_GET['status'])) {
        $where[] = 'o.Status = ?';
        $params[] = db_order_status((string) $_GET['status']);
    }
    $sql = 'SELECT o.*, u.Username, u.Email FROM `Order` o LEFT JOIN `Users` u ON u.UserID = o.UserID';
    if ($where !== []) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    $sql .= ' ORDER BY o.CreatedAt DESC';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    json_response(['success' => true, 'data' => array_map('order_row', $stmt->fetchAll())]);
}

function order_detail(string $id): void
{
    $orderId = int_id($id, 'o');
    $stmt = db()->prepare('SELECT o.*, u.Username, u.Email FROM `Order` o LEFT JOIN `Users` u ON u.UserID = o.UserID WHERE o.OrderID = ?');
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    if (!$order) {
        error_response('Không tìm thấy đơn hàng.', 404);
    }
    if (current_user_role() !== 'admin' && current_user_id() !== (int) $order['UserID']) {
        error_response('Bạn không có quyền xem đơn hàng này.', 403);
    }
    json_response(['success' => true, 'data' => order_row($order)]);
}

function order_status(string $id): void
{
    require_admin();
    $orderId = int_id($id, 'o');
    $data = body();
    require_fields($data, ['status']);
    $newStatus = db_order_status((string) $data['status']);

    db()->beginTransaction();
    try {
        $stmt = db()->prepare('SELECT Status FROM `Order` WHERE OrderID = ? FOR UPDATE');
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();
        if (!$order) {
            throw new RuntimeException('Không tìm thấy đơn hàng.');
        }
        $oldStatus = (string) $order['Status'];

        db()->prepare('UPDATE `Order` SET Status = ? WHERE OrderID = ?')->execute([$newStatus, $orderId]);
        if ($newStatus === 'Đã xác nhận' && $oldStatus === 'Chưa xác nhận') {
            inventory_for_order($orderId, -1, 'Xuất bán');
        } elseif (in_array($newStatus, ['Đã hủy', 'Giao thất bại', 'Đã trả về cửa hàng'], true)
            && in_array($oldStatus, ['Đã xác nhận', 'Đang giao'], true)) {
            inventory_for_order($orderId, 1, 'Hoàn hàng');
        }
        db()->commit();
        order_detail((string) $orderId);
    } catch (Throwable $exception) {
        db()->rollBack();
        error_response($exception->getMessage(), 422);
    }
}

function inventory_for_order(int $orderId, int $direction, string $reason): void
{
    $stmt = db()->prepare('SELECT ProductID, Quantity FROM `OrderDetail` WHERE OrderID = ?');
    $stmt->execute([$orderId]);
    foreach ($stmt->fetchAll() as $item) {
        $change = $direction * (int) $item['Quantity'];
        db()->prepare('UPDATE `Inventory` SET StockQuantity = StockQuantity + ? WHERE ProductID = ?')
            ->execute([$change, (int) $item['ProductID']]);
        db()->prepare('INSERT INTO `InventoryLog` (ProductID, OrderID, ChangeQuantity, Reason) VALUES (?, ?, ?, ?)')
            ->execute([(int) $item['ProductID'], $orderId, $change, $reason]);
        if ($direction < 0) {
            db()->prepare('UPDATE `Product` SET SoldQuantity = SoldQuantity + ? WHERE ProductID = ?')
                ->execute([(int) $item['Quantity'], (int) $item['ProductID']]);
        }
    }
}

function payment_status(string $id): void
{
    require_admin();
    $data = body();
    require_fields($data, ['status']);
    $status = db_payment_status((string) $data['status']);
    $date = in_array($status, ['Đã thanh toán', 'Đã hoàn tiền'], true) ? date('Y-m-d H:i:s') : null;
    db()->prepare('UPDATE `Payment` SET Status = ?, PaymentDate = ? WHERE OrderID = ?')
        ->execute([$status, $date, int_id($id, 'o')]);
    order_detail($id);
}

function cancel_request_list(): void
{
    $where = [];
    $params = [];
    if (current_user_role() !== 'admin') {
        $where[] = 'cr.UserID = ?';
        $params[] = require_login();
    }
    $sql = 'SELECT cr.* FROM `CancelRequest` cr';
    if ($where !== []) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    $sql .= ' ORDER BY cr.CreatedAt DESC';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    $data = array_map(static fn(array $row): array => [
        'id' => 'cr' . $row['RequestID'],
        'orderId' => 'o' . $row['OrderID'],
        'reason' => $row['ReasonBuyer'],
        'adminReason' => $row['ReasonAdmin'],
        'status' => strtolower((string) $row['Status']) === 'approved' ? 'approved' : (strtolower((string) $row['Status']) === 'rejected' ? 'rejected' : 'pending'),
        'contactedBuyer' => $row['ResolvedBy'] !== null,
        'createdAt' => $row['CreatedAt'],
    ], $stmt->fetchAll());
    json_response(['success' => true, 'data' => $data]);
}

function cancel_request_create(): void
{
    $userId = require_login();
    $data = body();
    require_fields($data, ['orderId', 'reason']);
    $orderId = int_id($data['orderId'], 'o');
    $stmt = db()->prepare('SELECT OrderID FROM `Order` WHERE OrderID = ? AND UserID = ?');
    $stmt->execute([$orderId, $userId]);
    if (!$stmt->fetch()) {
        error_response('Không tìm thấy đơn hàng của bạn.', 404);
    }
    db()->prepare('INSERT INTO `CancelRequest` (OrderID, UserID, ReasonBuyer, Status) VALUES (?, ?, ?, "Pending")')
        ->execute([$orderId, $userId, $data['reason']]);
    json_response(['success' => true]);
}

function cancel_request_process(string $id): void
{
    require_admin();
    $data = body();
    require_fields($data, ['status']);
    $requestId = int_id($id, 'cr');
    $status = $data['status'] === 'approved' ? 'Approved' : 'Rejected';

    db()->beginTransaction();
    try {
        $stmt = db()->prepare('SELECT OrderID FROM `CancelRequest` WHERE RequestID = ? FOR UPDATE');
        $stmt->execute([$requestId]);
        $request = $stmt->fetch();
        if (!$request) {
            throw new RuntimeException('Không tìm thấy yêu cầu hủy.');
        }
        db()->prepare('UPDATE `CancelRequest` SET Status = ?, ReasonAdmin = ?, ResolvedAt = NOW(), ResolvedBy = ? WHERE RequestID = ?')
            ->execute([$status, $data['adminReason'] ?? null, current_user_id(), $requestId]);
        if ($status === 'Approved') {
            db()->prepare("UPDATE `Order` SET Status = 'Đã hủy' WHERE OrderID = ?")->execute([(int) $request['OrderID']]);
        }
        db()->commit();
        json_response(['success' => true]);
    } catch (Throwable $exception) {
        db()->rollBack();
        error_response($exception->getMessage(), 422);
    }
}

function review_list(): void
{
    $productId = !empty($_GET['productId']) ? int_id($_GET['productId'], 'p') : null;
    $where = ['r.Status = "active"'];
    $params = [];
    if ($productId) {
        $where[] = 'r.ProductID = ?';
        $params[] = $productId;
    }
    $stmt = db()->prepare(
        'SELECT r.*, u.Username
         FROM `Review` r
         JOIN `Users` u ON u.UserID = r.UserID
         WHERE ' . implode(' AND ', $where) . '
         ORDER BY r.CreatedAt DESC'
    );
    $stmt->execute($params);
    $data = array_map(static fn(array $row): array => [
        'id' => 'r' . $row['ReviewID'],
        'productId' => 'p' . $row['ProductID'],
        'userName' => $row['Username'],
        'rating' => (int) $row['Rating'],
        'comment' => $row['Comment'],
        'status' => $row['Status'],
        'createdAt' => $row['CreatedAt'],
    ], $stmt->fetchAll());
    json_response(['success' => true, 'data' => $data]);
}

function review_create(): void
{
    $data = body();
    require_fields($data, ['productId', 'rating', 'comment']);
    db()->prepare('INSERT INTO `Review` (ProductID, UserID, Rating, Comment, Status) VALUES (?, ?, ?, ?, "active")')
        ->execute([int_id($data['productId'], 'p'), require_login(), (int) $data['rating'], $data['comment']]);
    json_response(['success' => true]);
}

function review_status(string $id): void
{
    require_admin();
    $data = body();
    db()->prepare('UPDATE `Review` SET Status = ? WHERE ReviewID = ?')->execute([$data['status'] ?? 'hidden', int_id($id, 'r')]);
    json_response(['success' => true]);
}

function review_delete(string $id): void
{
    require_admin();
    db()->prepare('DELETE FROM `Review` WHERE ReviewID = ?')->execute([int_id($id, 'r')]);
    json_response(['success' => true]);
}

function inventory_list(): void
{
    require_admin();
    $stmt = db()->query(
        'SELECT i.*, p.ProductName, p.ProductImage, c.CategoryName
         FROM `Inventory` i
         JOIN `Product` p ON p.ProductID = i.ProductID
         JOIN `Category` c ON c.CategoryID = p.CategoryID
         ORDER BY i.StockQuantity ASC, p.ProductName ASC'
    );
    $data = array_map(static fn(array $row): array => [
        'productId' => 'p' . $row['ProductID'],
        'productName' => $row['ProductName'],
        'productImage' => $row['ProductImage'],
        'category' => $row['CategoryName'],
        'stock' => (int) $row['StockQuantity'],
        'lowStockThreshold' => (int) $row['LowStockThreshold'],
        'lastUpdated' => $row['DateUpdate'],
    ], $stmt->fetchAll());
    json_response(['success' => true, 'data' => $data]);
}

function inventory_update(string $id): void
{
    require_admin();
    $productId = int_id($id, 'p');
    $data = body();
    $delta = isset($data['quantityDelta']) ? (int) $data['quantityDelta'] : null;
    $newStock = isset($data['stock']) ? (int) $data['stock'] : null;
    if ($delta === null && $newStock === null) {
        error_response('Cần truyền stock hoặc quantityDelta.', 422);
    }

    db()->beginTransaction();
    try {
        $stmt = db()->prepare('SELECT StockQuantity FROM `Inventory` WHERE ProductID = ? FOR UPDATE');
        $stmt->execute([$productId]);
        $current = $stmt->fetch();
        if (!$current) {
            throw new RuntimeException('Không tìm thấy tồn kho.');
        }
        $change = $delta ?? ($newStock - (int) $current['StockQuantity']);
        db()->prepare('UPDATE `Inventory` SET StockQuantity = StockQuantity + ?, LowStockThreshold = COALESCE(?, LowStockThreshold) WHERE ProductID = ?')
            ->execute([$change, $data['lowStockThreshold'] ?? null, $productId]);
        db()->prepare('INSERT INTO `InventoryLog` (ProductID, ChangeQuantity, Reason) VALUES (?, ?, ?)')
            ->execute([$productId, $change, $data['reason'] ?? 'Thay đổi số lượng']);
        db()->commit();
        json_response(['success' => true]);
    } catch (Throwable $exception) {
        db()->rollBack();
        error_response($exception->getMessage(), 422);
    }
}

function report_dashboard(): void
{
    require_admin();
    $stats = [
        'totalProducts' => (int) db()->query('SELECT COUNT(*) FROM `Product`')->fetchColumn(),
        'totalCategories' => (int) db()->query('SELECT COUNT(*) FROM `Category`')->fetchColumn(),
        'totalArticles' => count(static_articles()),
        'totalOrders' => (int) db()->query('SELECT COUNT(*) FROM `Order`')->fetchColumn(),
        'revenue' => (int) db()->query("SELECT COALESCE(SUM(TotalAmount), 0) FROM `Order` WHERE Status = 'Hoàn thành'")->fetchColumn(),
        'profit' => (int) db()->query(
            "SELECT COALESCE(SUM((od.Price - p.ImportPrice) * od.Quantity), 0)
             FROM `OrderDetail` od
             JOIN `Order` o ON o.OrderID = od.OrderID
             JOIN `Product` p ON p.ProductID = od.ProductID
             WHERE o.Status = 'Hoàn thành'"
        )->fetchColumn(),
    ];
    json_response(['success' => true, 'data' => $stats]);
}

function report_revenue(): void
{
    require_admin();
    $stmt = db()->query(
        "SELECT DATE_FORMAT(o.OrderDate, '%Y-%m') AS month,
                SUM(o.TotalAmount) AS revenue,
                SUM((od.Price - p.ImportPrice) * od.Quantity) AS profit,
                COUNT(DISTINCT o.OrderID) AS orderCount
         FROM `Order` o
         JOIN `OrderDetail` od ON od.OrderID = o.OrderID
         JOIN `Product` p ON p.ProductID = od.ProductID
         WHERE o.Status = 'Hoàn thành'
         GROUP BY DATE_FORMAT(o.OrderDate, '%Y-%m')
         ORDER BY month ASC"
    );
    json_response(['success' => true, 'data' => $stmt->fetchAll()]);
}

function report_categories(): void
{
    require_admin();
    $stmt = db()->query(
        "SELECT c.CategoryName AS name,
                COUNT(DISTINCT o.OrderID) AS orders,
                COALESCE(SUM(od.Price * od.Quantity), 0) AS revenue
         FROM `Category` c
         LEFT JOIN `Product` p ON p.CategoryID = c.CategoryID
         LEFT JOIN `OrderDetail` od ON od.ProductID = p.ProductID
         LEFT JOIN `Order` o ON o.OrderID = od.OrderID AND o.Status = 'Hoàn thành'
         GROUP BY c.CategoryID
         ORDER BY revenue DESC"
    );
    $rows = $stmt->fetchAll();
    $total = array_sum(array_map(static fn(array $row): int => (int) $row['revenue'], $rows));
    $data = array_map(static fn(array $row): array => [
        'name' => $row['name'],
        'orders' => (int) $row['orders'],
        'revenue' => (int) $row['revenue'],
        'percent' => $total > 0 ? round(((int) $row['revenue'] / $total) * 100, 1) : 0,
    ], $rows);

    json_response(['success' => true, 'data' => $data]);
}

function static_articles(): array
{
    return [
        [
            'id' => 'news-1',
            'title' => 'Xu hướng thời trang secondhand 2026',
            'slug' => 'xu-huong-thoi-trang-secondhand-2026',
            'excerpt' => 'Gợi ý phối đồ secondhand để mặc hằng ngày, gọn gàng và tiết kiệm.',
            'content' => "Năm 2026, thời trang secondhand tiếp tục được yêu thích vì tính cá nhân, giá hợp lý và tinh thần tiêu dùng bền vững. Những món đồ có chất liệu tốt như linen, denim, kaki và da thật thường được săn tìm nhiều hơn vì dễ phối và có tuổi thọ cao.\n\nMột công thức đơn giản cho trang phục hằng ngày là kết hợp áo thun basic với quần jeans ống đứng, thêm áo sơ mi khoác ngoài hoặc blazer mỏng. Cách phối này phù hợp đi học, đi làm, đi chơi cuối tuần mà vẫn giữ được nét riêng.\n\nKhi mua đồ secondhand, bạn nên ưu tiên sản phẩm còn form, đường may chắc, vải không bai dão và màu sắc dễ phối. Một món đồ tốt không nhất thiết phải nổi bật ngay từ cái nhìn đầu tiên, nhưng cần khiến bạn mặc được nhiều lần trong nhiều hoàn cảnh khác nhau.",
            'image' => 'https://picsum.photos/seed/news1/800/400',
            'category' => 'news',
            'createdAt' => '2026-04-20T00:00:00Z',
            'isPublished' => true,
        ],
        [
            'id' => 'news-2',
            'title' => 'Cách bảo quản đồ 2hand luôn như mới',
            'slug' => 'cach-bao-quan-do-2hand-luon-nhu-moi',
            'excerpt' => 'Một vài mẹo nhỏ giúp quần áo secondhand bền hơn và giữ form tốt.',
            'content' => "Đồ secondhand sau khi mua về nên được giặt riêng lần đầu bằng nước lạnh hoặc nước ấm nhẹ. Với các chất liệu mỏng như voan, lụa, linen, bạn nên dùng túi giặt hoặc giặt tay để hạn chế xù vải và biến dạng form.\n\nKhi phơi, hãy lộn mặt trái sản phẩm và tránh nắng gắt trực tiếp quá lâu. Áo khoác, blazer và sơ mi nên được treo bằng móc có vai rộng để giữ dáng. Với đồ len hoặc đồ dệt, nên gấp gọn thay vì treo để tránh chảy vai.\n\nNếu sản phẩm có phụ kiện kim loại, da hoặc chi tiết thêu, bạn nên vệ sinh nhẹ bằng khăn mềm. Việc chăm sóc đúng cách sẽ giúp món đồ secondhand giữ được vẻ đẹp lâu hơn, đồng thời giảm nhu cầu mua mới liên tục.",
            'image' => 'https://picsum.photos/seed/news2/800/400',
            'category' => 'news',
            'createdAt' => '2026-04-22T00:00:00Z',
            'isPublished' => true,
        ],
        ['id' => 'about', 'title' => 'Câu chuyện của 2HANDWORLD', 'slug' => 'gioi-thieu', 'excerpt' => 'Giới thiệu thương hiệu.', 'content' => '2HANDWORLD là website mua bán đồ secondhand theo mô hình admin bán - buyer mua.', 'image' => '', 'category' => 'about', 'createdAt' => '2026-04-26T00:00:00Z', 'isPublished' => true],
        ['id' => 'policy', 'title' => 'Chính sách mua hàng', 'slug' => 'chinh-sach', 'excerpt' => 'Quy định đặt hàng, thanh toán và đổi trả.', 'content' => 'Nội dung chính sách được quản lý tĩnh theo phạm vi đồ án.', 'image' => '', 'category' => 'policy', 'createdAt' => '2026-04-26T00:00:00Z', 'isPublished' => true],
        ['id' => 'contact', 'title' => 'Liên hệ', 'slug' => 'lien-he', 'excerpt' => 'Thông tin liên hệ cửa hàng.', 'content' => 'Hotline: 0901234567. Địa chỉ: TP.HCM.', 'image' => '', 'category' => 'contact', 'createdAt' => '2026-04-26T00:00:00Z', 'isPublished' => true],
    ];
}

function content_list(): void
{
    json_response(['success' => true, 'data' => static_articles()]);
}

function store_list(): void
{
    json_response(['success' => true, 'data' => [[
        'id' => 'main',
        'name' => '2HANDWORLD',
        'address' => 'TP.HCM',
        'phone' => '0901234567',
        'image' => 'https://picsum.photos/seed/2handworld-store/400/300',
    ]]]);
}

function cart_id(): int
{
    $userId = current_user_id();
    $sessionId = session_id();
    if ($userId !== null) {
        $stmt = db()->prepare('SELECT CartID FROM `Cart` WHERE UserID = ? LIMIT 1');
        $stmt->execute([$userId]);
        $cart = $stmt->fetch();
        if ($cart) {
            return (int) $cart['CartID'];
        }
        db()->prepare('INSERT INTO `Cart` (UserID, SessionID) VALUES (?, ?)')->execute([$userId, $sessionId]);
    } else {
        $stmt = db()->prepare('SELECT CartID FROM `Cart` WHERE SessionID = ? LIMIT 1');
        $stmt->execute([$sessionId]);
        $cart = $stmt->fetch();
        if ($cart) {
            return (int) $cart['CartID'];
        }
        db()->prepare('INSERT INTO `Cart` (SessionID) VALUES (?)')->execute([$sessionId]);
    }
    return (int) db()->lastInsertId();
}

function cart_get(): void
{
    $cartId = cart_id();
    $stmt = db()->prepare(
        'SELECT ci.Quantity, p.*, c.CategoryName, COALESCE(i.StockQuantity, 0) AS StockQuantity
         FROM `CartItems` ci
         JOIN `Product` p ON p.ProductID = ci.ProductID
         JOIN `Category` c ON c.CategoryID = p.CategoryID
         LEFT JOIN `Inventory` i ON i.ProductID = p.ProductID
         WHERE ci.CartID = ?'
    );
    $stmt->execute([$cartId]);
    $items = array_map(static fn(array $row): array => [
        'product' => product_row($row),
        'quantity' => (int) $row['Quantity'],
    ], $stmt->fetchAll());
    json_response(['success' => true, 'data' => $items]);
}

function cart_add(): void
{
    $data = body();
    require_fields($data, ['productId']);
    $cartId = cart_id();
    $productId = int_id($data['productId'], 'p');
    $quantity = max(1, (int) ($data['quantity'] ?? 1));
    $existing = db()->prepare('SELECT CartItemsID FROM `CartItems` WHERE CartID = ? AND ProductID = ?');
    $existing->execute([$cartId, $productId]);
    if ($row = $existing->fetch()) {
        db()->prepare('UPDATE `CartItems` SET Quantity = Quantity + ? WHERE CartItemsID = ?')->execute([$quantity, (int) $row['CartItemsID']]);
    } else {
        db()->prepare('INSERT INTO `CartItems` (CartID, ProductID, Quantity) VALUES (?, ?, ?)')->execute([$cartId, $productId, $quantity]);
    }
    cart_get();
}

function cart_update(string $productIdValue): void
{
    $data = body();
    $cartId = cart_id();
    $productId = int_id($productIdValue, 'p');
    $quantity = (int) ($data['quantity'] ?? 0);
    if ($quantity <= 0) {
        db()->prepare('DELETE FROM `CartItems` WHERE CartID = ? AND ProductID = ?')->execute([$cartId, $productId]);
    } else {
        db()->prepare('UPDATE `CartItems` SET Quantity = ? WHERE CartID = ? AND ProductID = ?')->execute([$quantity, $cartId, $productId]);
    }
    cart_get();
}

function cart_clear(): void
{
    db()->prepare('DELETE FROM `CartItems` WHERE CartID = ?')->execute([cart_id()]);
    cart_get();
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_GET['r'] ?? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $path = trim(preg_replace('#^/2handworld/Web/backend/api#', '', (string) $path), '/');
    $segments = $path === '' ? [] : explode('/', $path);

    if ($segments === [] || $segments[0] === 'health') {
        json_response(['success' => true, 'message' => '2HANDWORLD API is running']);
    }

    match ([$method, $segments[0], $segments[1] ?? null, $segments[2] ?? null]) {
        ['POST', 'auth', 'register', null] => auth_register(),
        ['POST', 'auth', 'login', null] => auth_login(),
        ['POST', 'auth', 'logout', null] => (session_destroy() || true) && json_response(['success' => true]),
        ['GET', 'auth', 'me', null] => user_me(),

        ['GET', 'products', null, null] => product_list(),
        ['POST', 'products', null, null] => product_create(),
        ['GET', 'products', $segments[1] ?? '', null] => product_detail($segments[1]),
        ['PUT', 'products', $segments[1] ?? '', null] => product_update($segments[1]),
        ['PATCH', 'products', $segments[1] ?? '', null] => product_update($segments[1]),
        ['DELETE', 'products', $segments[1] ?? '', null] => product_delete($segments[1]),

        ['GET', 'categories', null, null] => category_list(),
        ['POST', 'categories', null, null] => category_save(),
        ['PUT', 'categories', $segments[1] ?? '', null] => category_save($segments[1]),
        ['DELETE', 'categories', $segments[1] ?? '', null] => category_delete($segments[1]),

        ['GET', 'cart', null, null] => cart_get(),
        ['POST', 'cart', 'items', null] => cart_add(),
        ['PUT', 'cart', 'items', $segments[2] ?? ''] => cart_update($segments[2]),
        ['DELETE', 'cart', 'items', $segments[2] ?? ''] => cart_update($segments[2]),
        ['DELETE', 'cart', null, null] => cart_clear(),

        ['GET', 'orders', null, null] => order_list(),
        ['POST', 'orders', null, null] => order_create(),
        ['GET', 'orders', $segments[1] ?? '', null] => order_detail($segments[1]),
        ['PATCH', 'orders', $segments[1] ?? '', 'status'] => order_status($segments[1]),
        ['PATCH', 'orders', $segments[1] ?? '', 'payment'] => payment_status($segments[1]),

        ['GET', 'cancel-requests', null, null] => cancel_request_list(),
        ['POST', 'cancel-requests', null, null] => cancel_request_create(),
        ['PATCH', 'cancel-requests', $segments[1] ?? '', 'process'] => cancel_request_process($segments[1]),

        ['GET', 'reviews', null, null] => review_list(),
        ['POST', 'reviews', null, null] => review_create(),
        ['PATCH', 'reviews', $segments[1] ?? '', 'status'] => review_status($segments[1]),
        ['DELETE', 'reviews', $segments[1] ?? '', null] => review_delete($segments[1]),

        ['GET', 'users', null, null] => user_list(),
        ['PUT', 'users', 'me', null] => user_update(),
        ['PATCH', 'users', $segments[1] ?? '', 'status'] => user_status($segments[1]),
        ['POST', 'blacklist', null, null] => blacklist_create(),

        ['GET', 'inventory', null, null] => inventory_list(),
        ['PATCH', 'inventory', $segments[1] ?? '', null] => inventory_update($segments[1]),

        ['GET', 'reports', 'dashboard', null] => report_dashboard(),
        ['GET', 'reports', 'revenue', null] => report_revenue(),
        ['GET', 'reports', 'categories', null] => report_categories(),

        ['GET', 'content', null, null] => content_list(),
        ['GET', 'stores', null, null] => store_list(),

        default => error_response('Endpoint không tồn tại.', 404),
    };
} catch (PDOException $exception) {
    error_response('Lỗi database: ' . $exception->getMessage(), 500);
} catch (Throwable $exception) {
    error_response($exception->getMessage(), 500);
}
