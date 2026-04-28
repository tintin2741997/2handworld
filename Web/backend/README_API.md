# 2HANDWORLD PHP Backend

Base URL khi chạy bằng XAMPP:

```text
http://localhost/2handworld/Web/backend/api
```

Frontend chạy bằng Vite:

```bat
cd C:\xampp\htdocs\2handworld
npm run dev
```

Sau đó mở:

```text
http://127.0.0.1:5173
```

Nếu đang đứng trong thư mục `Web`, cũng có thể chạy:

```bat
cd C:\xampp\htdocs\2handworld\Web
npm run dev
```

## Database

File kết nối: `backend/config/database.php`

Mặc định backend dùng:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=2handworld_schema
DB_USERNAME=root
DB_PASSWORD=
```

Import schema và dữ liệu demo:

```bat
C:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 -e "DROP DATABASE IF EXISTS `2handworld_schema`; SOURCE C:/xampp/htdocs/2handworld/Web/database/DB_2handworld_Update.sql;"
C:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 2handworld_schema < C:\xampp\htdocs\2handworld\Web\database\seed_2handworld_demo.sql
```

Tài khoản demo:

```text
Admin: admin@2hand.vn / admin123
Buyer: nguyenvana@gmail.com / 123456
VIP: tranthib@gmail.com / 123456
Blacklist: lehoangc@gmail.com / 123456
```

## Endpoint Chính

Auth:

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

Sản phẩm và danh mục:

```text
GET    /products?search=&category=c1&condition=&sale=1&sort=newest
GET    /products/p1
POST   /products
PATCH  /products/p1
DELETE /products/p1
GET    /categories
POST   /categories
PUT    /categories/c1
```

Giỏ hàng và checkout:

```text
GET    /cart
POST   /cart/items
PUT    /cart/items/p1
DELETE /cart/items/p1
DELETE /cart
POST   /orders
```

Đơn hàng, thanh toán, hủy đơn:

```text
GET   /orders
GET   /orders/o1
PATCH /orders/o1/status
PATCH /orders/o1/payment
GET   /cancel-requests
POST  /cancel-requests
PATCH /cancel-requests/cr1/process
```

Admin:

```text
GET   /users
PATCH /users/u2/status
POST  /blacklist
GET   /inventory
PATCH /inventory/p1
GET   /reports/dashboard
GET   /reports/revenue
```

Nội dung tĩnh theo phạm vi đồ án:

```text
GET /content
GET /stores
```

Các request ghi dữ liệu dùng JSON body và response luôn ở dạng:

```json
{
  "success": true,
  "data": {}
}
```
