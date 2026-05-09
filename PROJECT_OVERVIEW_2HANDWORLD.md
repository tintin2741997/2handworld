# Tổng Quan Dự Án 2HANDWORLD

Tài liệu này giải thích toàn bộ dự án 2HANDWORLD theo code hiện tại trong repo. Mục tiêu là giúp bạn hiểu dự án từ tổng quan đến chi tiết: frontend, backend, database, cách kết nối, MySQL, trigger, view, function, procedure, phân quyền và test E2E.

> Lưu ý: một số file code hiện đang hiển thị tiếng Việt bị lỗi mã hóa khi xem qua terminal. Logic vẫn đọc được, nhưng khi chỉnh sửa nội dung tiếng Việt nên mở bằng editor UTF-8 và kiểm tra lại trên trình duyệt.

## 1. Tổng Quan Kiến Trúc

2HANDWORLD là website thương mại điện tử bán hàng second-hand. Dự án được chia thành 3 lớp chính:

1. **Frontend**: React + TypeScript + Vite, nằm trong `Web/fontend`.
2. **Backend API**: PHP thuần + PDO + session, nằm trong `Web/backend`.
3. **Database**: MySQL schema, seed data, trigger, view, function, procedure, nằm trong `Web/database`.

Luồng hoạt động tổng quát:

```text
Browser
  -> React app chạy bằng Vite
  -> Frontend gọi API bằng fetch
  -> PHP backend xử lý request
  -> PHP dùng PDO truy vấn MySQL
  -> MySQL kiểm tra constraint, trigger, view, procedure
  -> PHP map dữ liệu database thành JSON
  -> React render giao diện buyer/admin
```

## 2. Cấu Trúc Thư Mục

```text
2handworld/
  Web/
    fontend/
      src/
        App.tsx
        services/api.ts
        contexts/
        pages/
        components/
        types/
      tests/e2e/
      playwright.config.ts
      vite.config.ts
      package.json

    backend/
      api/
        index.php
        .htaccess
        check.php
        verify_pass.php
        test_order_list.php
      config/
        database.php

    database/
      DB_2handworld_Update.sql
      routines_views_2handworld.sql
      permissions_2handworld.sql
      seed_*.sql
      seed_*.php
      migrate_status_enums_english.sql

  KICH_BAN_DEMO_2HANDWORLD.md
  TRINH_BAY_DATABASE_2HANDWORLD.md
  PROJECT_OVERVIEW_2HANDWORLD.md
```

Các file quan trọng:

- `Web/fontend/src/App.tsx`: khai báo route buyer và admin.
- `Web/fontend/src/services/api.ts`: lớp gọi API dùng chung cho frontend.
- `Web/fontend/src/contexts`: quản lý state đăng nhập, giỏ hàng, đơn hàng.
- `Web/backend/api/index.php`: entrypoint duy nhất cho toàn bộ REST API.
- `Web/backend/config/database.php`: cấu hình kết nối MySQL bằng PDO.
- `Web/database/DB_2handworld_Update.sql`: tạo database, bảng, khóa ngoại, constraint, trigger, function, procedure, view.
- `Web/database/routines_views_2handworld.sql`: tạo lại function, procedure, view.
- `Web/database/permissions_2handworld.sql`: tạo role/user MySQL và cấp quyền.

## 3. Cách Chạy Local

Dự án đang được thiết kế để chạy với XAMPP.

1. Đặt project tại:

```text
c:\xampp\htdocs\2handworld
```

2. Bật Apache và MySQL trong XAMPP.

3. Tạo database bằng MySQL:

```sql
SOURCE Web/database/DB_2handworld_Update.sql;
SOURCE Web/database/seed_2handworld_demo.sql;
```

Nếu chỉ cần tạo lại function, procedure, view:

```sql
SOURCE Web/database/routines_views_2handworld.sql;
```

Nếu cần tạo user/role MySQL:

```sql
SOURCE Web/database/permissions_2handworld.sql;
```

4. Chạy frontend:

```bash
cd Web/fontend
npm install
npm run dev
```

Frontend mặc định chạy tại:

```text
http://127.0.0.1:5173
```

Backend API mặc định:

```text
http://127.0.0.1/2handworld/Web/backend/api
```

## 4. Cách Frontend Kết Nối Backend

File `Web/fontend/src/services/api.ts` định nghĩa địa chỉ API:

```ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1/2handworld/Web/backend/api';
```

Nếu không có biến môi trường `VITE_API_BASE_URL`, frontend sẽ gọi thẳng PHP API trong XAMPP.

File này tạo các hàm dùng chung:

- `api.get<T>(path)`
- `api.post<T>(path, data)`
- `api.put<T>(path, data)`
- `api.patch<T>(path, data)`
- `api.delete<T>(path)`

Mỗi request:

- gọi `fetch(API_BASE_URL + path)`;
- gửi header `Content-Type: application/json`;
- bật `credentials: 'include'` để browser gửi cookie session PHP;
- đọc response dạng `{ success, data, message, details }`;
- nếu lỗi HTTP hoặc `success === false` thì ném `ApiError`.

Điểm quan trọng: frontend không tự kết nối MySQL. Frontend chỉ gọi PHP API. PHP mới là lớp truy cập database.

## 5. Frontend

### 5.1 Công Nghệ Sử Dụng

Frontend dùng:

- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- lucide-react cho icon
- framer-motion cho animation
- recharts cho biểu đồ báo cáo
- Playwright cho test E2E

### 5.2 Router

Router nằm trong `Web/fontend/src/App.tsx`.

Buyer routes:

- `/`: trang chủ.
- `/san-pham`: danh sách sản phẩm.
- `/san-pham/:id`: chi tiết sản phẩm.
- `/gio-hang`: giỏ hàng.
- `/thanh-toan`: checkout.
- `/dang-nhap`: đăng nhập/đăng ký.
- `/ho-so`: hồ sơ người dùng.
- `/don-hang`: đơn hàng của tôi.
- `/cua-hang`: danh sách cửa hàng.
- `/tin-tuc`: tin tức.
- `/tin-tuc/:slug`: chi tiết tin tức/demo.
- `/gioi-thieu`: trang giới thiệu.
- `/chinh-sach`: trang chính sách.
- `/lien-he`: trang liên hệ.
- `/sitemap`: sơ đồ trang.

Admin routes dưới `/admin`:

- `/admin`: dashboard.
- `/admin/san-pham`: quản lý sản phẩm.
- `/admin/danh-muc`: quản lý danh mục.
- `/admin/cua-hang`: quản lý cửa hàng.
- `/admin/noi-dung`: quản lý nội dung.
- `/admin/don-hang`: quản lý đơn hàng.
- `/admin/doanh-thu`: báo cáo doanh thu.
- `/admin/danh-gia`: quản lý đánh giá.
- `/admin/nguoi-dung`: quản lý người dùng, VIP, blacklist.
- `/admin/ton-kho`: quản lý tồn kho.

### 5.3 Layout

Buyer page dùng `BuyerLayout` trong `App.tsx`:

```text
Header
  -> Nội dung trang
Footer
```

Admin page dùng `AdminLayout`, có sidebar và vùng nội dung quản trị.

### 5.4 AuthContext

File: `Web/fontend/src/contexts/AuthContext.tsx`

Quản lý:

- user đang đăng nhập;
- `isLoggedIn`;
- `isAdmin`;
- login;
- logout;
- register;
- update profile.

User được lưu tạm vào `localStorage` với key:

```text
2hand_user
```

Nhưng nguồn xác thực chính vẫn là backend thông qua session PHP và endpoint:

- `GET /auth/me`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/register`
- `PUT /users/me`

### 5.5 CartContext

File: `Web/fontend/src/contexts/CartContext.tsx`

Quản lý:

- lấy giỏ hàng;
- thêm sản phẩm vào giỏ;
- xóa sản phẩm khỏi giỏ;
- cập nhật số lượng;
- xóa toàn bộ giỏ;
- tính tổng tiền;
- tính tổng số lượng sản phẩm.

Endpoint sử dụng:

- `GET /cart`
- `POST /cart/items`
- `PUT /cart/items/:productId`
- `DELETE /cart/items/:productId`
- `DELETE /cart`

Giỏ hàng hỗ trợ cả user đăng nhập và guest. Với guest, backend dùng `SessionID`.

### 5.6 OrderContext

File: `Web/fontend/src/contexts/OrderContext.tsx`

Quản lý:

- danh sách sản phẩm;
- danh sách đơn hàng;
- danh sách yêu cầu hủy;
- tạo đơn hàng;
- cập nhật trạng thái đơn hàng;
- cập nhật trạng thái thanh toán;
- tạo yêu cầu hủy;
- xử lý yêu cầu hủy;
- cập nhật tồn kho;
- refresh data.

Endpoint sử dụng:

- `GET /products`
- `GET /orders`
- `POST /orders`
- `PATCH /orders/:id/status`
- `PATCH /orders/:id/payment`
- `GET /cancel-requests`
- `POST /cancel-requests`
- `PATCH /cancel-requests/:id/process`
- `PATCH /inventory/:productId`

### 5.7 TypeScript Types

File `Web/fontend/src/types/index.ts` định nghĩa các kiểu dữ liệu dùng chung:

- `Category`
- `Store`
- `Product`
- `ProductPriceHistory`
- `CartItem`
- `Review`
- `OrderInfo`
- `Order`
- `CancelRequest`
- `User`
- `Article`
- `InventoryItem`
- `AdminStats`

Backend map dữ liệu database thành đúng shape này trước khi trả JSON về frontend. Vì vậy nếu sửa field ở frontend thì thường phải sửa cả mapper trong backend.

## 6. Backend PHP API

### 6.1 Entry Point

Toàn bộ API tập trung trong:

```text
Web/backend/api/index.php
```

File `.htaccess` trong `Web/backend/api` rewrite mọi request không phải file/folder về `index.php`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
```

Nhờ đó frontend có thể gọi:

```text
/products
/orders/o1/status
/cart/items/p2
```

nhưng PHP vẫn xử lý trong một file `index.php`.

### 6.2 CORS Và Session

Đầu file `index.php`:

- gọi `session_start()`;
- set response JSON UTF-8;
- cho phép origin `http://localhost:5173` và `http://127.0.0.1:5173`;
- cho phép credentials để dùng cookie session;
- cho phép methods `GET, POST, PUT, PATCH, DELETE, OPTIONS`;
- nếu request là `OPTIONS` thì trả `204`.

Session lưu:

- `$_SESSION['user_id']`
- `$_SESSION['role']`

### 6.3 Kết Nối Database

File:

```text
Web/backend/config/database.php
```

Class `Database` tạo kết nối PDO đến MySQL.

Giá trị mặc định:

- host: `127.0.0.1`
- port: `3306`
- database: `2handworld_schema`
- username: `root`
- password: rỗng

Có thể override bằng biến môi trường:

- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

PDO được cấu hình:

- `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`
- `PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC`
- `PDO::ATTR_EMULATE_PREPARES => false`

Điều này giúp query an toàn hơn, dễ debug hơn và tránh SQL injection khi dùng prepared statement.

### 6.4 Helper Quan Trọng Trong Backend

Trong `index.php` có nhiều helper:

- `db()`: lấy PDO connection.
- `call_procedure($sql, $params)`: gọi stored procedure.
- `json_response($data, $status)`: trả JSON và dừng request.
- `error_response($message, $status, $details)`: trả lỗi theo format chung.
- `body()`: đọc JSON body.
- `int_id($value, $prefix)`: đổi ID frontend như `p1`, `c2`, `o3` thành số nguyên.
- `require_fields($data, $fields)`: kiểm tra field bắt buộc.
- `current_user_id()`: lấy user id trong session.
- `current_user_role()`: lấy role trong session.
- `require_login()`: bắt buộc đăng nhập.
- `require_admin()`: bắt buộc quyền admin.
- `slugify()`: tạo slug.
- `product_row()`: map row sản phẩm từ database sang `Product` frontend.
- `order_row()`: map order, order detail, payment sang `Order` frontend.

### 6.5 Danh Sách Endpoint

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

Products:

- `GET /products`
- `POST /products`
- `GET /products/:id`
- `PUT /products/:id`
- `PATCH /products/:id`
- `DELETE /products/:id`
- `GET /products/:id/price-history`

Categories:

- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

Cart:

- `GET /cart`
- `POST /cart/items`
- `PUT /cart/items/:productId`
- `DELETE /cart/items/:productId`
- `DELETE /cart`

Orders:

- `GET /orders`
- `POST /orders`
- `GET /orders/:id`
- `PATCH /orders/:id/status`
- `PATCH /orders/:id/payment`

Cancel requests:

- `GET /cancel-requests`
- `POST /cancel-requests`
- `PATCH /cancel-requests/:id/process`

Reviews:

- `GET /reviews`
- `POST /reviews`
- `PATCH /reviews/:id/status`
- `DELETE /reviews/:id`

Users và blacklist:

- `GET /users`
- `PUT /users/me`
- `PATCH /users/:id/status`
- `POST /blacklist`

Inventory:

- `GET /inventory`
- `PATCH /inventory/:productId`

Reports:

- `GET /reports/dashboard`
- `GET /reports/revenue`
- `GET /reports/categories`

Nội dung tĩnh/demo:

- `GET /content`
- `GET /stores`

Health check:

- `/`
- `/health`

### 6.6 Bảo Mật Backend

Backend phân quyền ở tầng application:

- user chưa đăng nhập bị chặn bởi `require_login()`;
- thao tác admin bị chặn bởi `require_admin()`;
- buyer chỉ được xem đơn hàng của chính mình;
- guest có thể dùng giỏ hàng/session và checkout walk-in;
- admin xem đơn hàng sẽ có cảnh báo nếu user hoặc số điện thoại nằm trong blacklist.

Ngoài ra database có file `permissions_2handworld.sql` để tạo role MySQL riêng. Tuy nhiên backend hiện mặc định dùng `root` nếu không cấu hình biến môi trường. Nếu triển khai thật, nên dùng user MySQL riêng, không dùng root.

## 7. Database MySQL

### 7.1 Database Chính

Database:

```sql
CREATE DATABASE IF NOT EXISTS `2handworld_schema`
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

`utf8mb4` giúp hỗ trợ tiếng Việt và Unicode đầy đủ.

### 7.2 Các Bảng Chính

#### Users

Lưu tài khoản buyer/admin.

Cột quan trọng:

- `UserID`
- `Username`
- `Email`
- `PhoneNumber`
- `Password`
- `Address`
- `Status`
- `Role`
- `CreatedAt`
- `UpdatedAt`

Quy tắc:

- buyer có `Status` là `Normal`, `VIP`, hoặc `Blacklist`;
- admin có `Status = NULL`;
- role mặc định là `buyer`.

#### Category

Lưu danh mục sản phẩm:

- `CategoryID`
- `CategoryName`

#### Product

Lưu thông tin sản phẩm:

- `ProductID`
- `CategoryID`
- `ProductName`
- `ProductImage`
- `Price`
- `ImportPrice`
- `Description`
- `Condition`
- `SoldQuantity`
- `ProductStatus`
- `DiscountPercent`
- `CreatedAt`
- `UpdatedAt`

Quy tắc:

- giá bán và giá nhập phải lớn hơn 0;
- `ProductStatus` thuộc `active`, `hidden`, `sold-out`;
- `DiscountPercent` từ 0 đến 100.

#### Inventory

Lưu tồn kho:

- `InventoryID`
- `ProductID`
- `StockQuantity`
- `LowStockThreshold`
- `DateUpdate`

Quy tắc:

- số lượng tồn kho không được âm;
- ngưỡng cảnh báo sắp hết hàng không được âm.

#### InventoryLog

Lưu lịch sử thay đổi tồn kho:

- `LogID`
- `ProductID`
- `OrderID`
- `ChangeQuantity`
- `Reason`
- `LogDate`

Bảng này dùng để audit việc nhập hàng, xuất bán, hoàn hàng hoặc chỉnh tồn kho.

#### Blacklist

Lưu user hoặc số điện thoại có rủi ro:

- `BlacklistID`
- `UserID`
- `PhoneNumber`
- `Reason`
- `CreatedAt`

Quy tắc:

- lý do không được rỗng;
- phải có ít nhất `UserID` hoặc `PhoneNumber`.

#### Order

Lưu đơn hàng:

- `OrderID`
- `UserID`
- `OrderDate`
- `TotalAmount`
- `Status`
- `PhoneNumber`
- `Address`
- `CreatedAt`
- `UpdatedAt`

Status hợp lệ:

- `pending`
- `confirmed`
- `shipping`
- `completed`
- `cancelled`
- `failed_delivery`
- `returned`
- `rejected`

Trạng thái đóng:

- `completed`
- `cancelled`
- `failed_delivery`
- `returned`
- `rejected`

Khi đơn đã ở trạng thái đóng thì trigger sẽ chặn đổi sang trạng thái khác.

#### OrderDetail

Lưu sản phẩm trong đơn hàng:

- `OrderID`
- `ProductID`
- `Quantity`
- `Price`

Primary key gồm:

```sql
PRIMARY KEY (`OrderID`, `ProductID`)
```

Quy tắc:

- số lượng phải lớn hơn 0;
- giá phải lớn hơn 0;
- không được update sau khi tạo vì đây là dữ liệu lịch sử.

#### PaymentMethod

Lưu phương thức thanh toán:

- `MethodID`
- `MethodName`

Giá trị:

- `COD`
- `Bank`
- `Trực tiếp tại cửa hàng`

#### Payment

Lưu trạng thái thanh toán:

- `PaymentID`
- `OrderID`
- `MethodID`
- `Status`
- `PaymentDate`

Status:

- `unpaid`
- `paid`
- `failed`
- `refunded`

Quy tắc:

- nếu `paid` hoặc `refunded` thì `PaymentDate` phải có giá trị;
- nếu `unpaid` hoặc `failed` thì `PaymentDate` phải là `NULL`.

#### Review

Lưu đánh giá sản phẩm:

- `ReviewID`
- `ProductID`
- `UserID`
- `Rating`
- `Comment`
- `Status`
- `CreatedAt`

Quy tắc:

- rating từ 1 đến 5;
- admin có thể ẩn/hiện review qua `Status`.

#### CancelRequest

Lưu yêu cầu hủy đơn:

- `RequestID`
- `OrderID`
- `UserID`
- `ReasonBuyer`
- `ReasonAdmin`
- `Status`
- `CreatedAt`
- `ResolvedAt`
- `ResolvedBy`

Quy tắc:

- nếu đang `Pending` thì `ResolvedAt` và `ResolvedBy` phải là `NULL`;
- nếu đã xử lý thì `ResolvedAt` và `ResolvedBy` phải có giá trị;
- `ResolvedAt` không được trước `CreatedAt`.

#### ProductPriceHistory

Lưu lịch sử thay đổi giá:

- `HistoryID`
- `ProductID`
- `OldPrice`
- `NewPrice`
- `ChangedBy`
- `ChangedAt`

Quy tắc:

- giá cũ và giá mới phải lớn hơn 0;
- giá cũ phải khác giá mới.

#### Cart Và CartItems

`Cart` lưu giỏ hàng:

- `CartID`
- `UserID`
- `SessionID`

`CartItems` lưu sản phẩm trong giỏ:

- `CartItemsID`
- `CartID`
- `ProductID`
- `Quantity`

Thiết kế này hỗ trợ:

- buyer đăng nhập: cart gắn với `UserID`;
- guest: cart gắn với `SessionID`.

### 7.3 Quan Hệ Khóa Ngoại

Các quan hệ chính:

- `Product.CategoryID -> Category.CategoryID`
- `Blacklist.UserID -> Users.UserID`
- `Order.UserID -> Users.UserID`
- `OrderDetail.OrderID -> Order.OrderID`
- `OrderDetail.ProductID -> Product.ProductID`
- `Payment.OrderID -> Order.OrderID`
- `Payment.MethodID -> PaymentMethod.MethodID`
- `Review.ProductID -> Product.ProductID`
- `Review.UserID -> Users.UserID`
- `CancelRequest.OrderID -> Order.OrderID`
- `CancelRequest.UserID -> Users.UserID`
- `CancelRequest.ResolvedBy -> Users.UserID`
- `Inventory.ProductID -> Product.ProductID`
- `InventoryLog.ProductID -> Product.ProductID`
- `InventoryLog.OrderID -> Order.OrderID`
- `ProductPriceHistory.ProductID -> Product.ProductID`
- `ProductPriceHistory.ChangedBy -> Users.UserID`
- `Cart.UserID -> Users.UserID`
- `CartItems.CartID -> Cart.CartID`
- `CartItems.ProductID -> Product.ProductID`

## 8. Trigger

Trigger nằm trong `Web/database/DB_2handworld_Update.sql`.

### 8.1 `trg_BeforeInsert_OrderDetail_StockCheck`

Chạy:

```sql
BEFORE INSERT ON OrderDetail
```

Mục đích:

- trước khi thêm chi tiết đơn hàng, kiểm tra tồn kho;
- nếu không có tồn kho hoặc số lượng mua lớn hơn tồn kho thì báo lỗi bằng `SIGNAL SQLSTATE '45000'`.

Ý nghĩa:

- ngăn tạo đơn vượt quá số lượng tồn;
- database vẫn bảo vệ rule kể cả khi backend bị lỗi.

### 8.2 `trg_AfterUpdate_Inventory_SyncStatus`

Chạy:

```sql
AFTER UPDATE ON Inventory
```

Mục đích:

- nếu tồn kho từ lớn hơn 0 về 0 thì đổi `ProductStatus` thành `sold-out`;
- nếu tồn kho từ 0 lên lớn hơn 0 thì đổi `ProductStatus` thành `active`.

Ý nghĩa:

- đồng bộ trạng thái sản phẩm với tồn kho;
- admin chỉ cần cập nhật tồn kho, trạng thái sản phẩm sẽ tự đổi.

### 8.3 `trg_BeforeUpdate_Order_StateMachine`

Chạy:

```sql
BEFORE UPDATE ON Order
```

Mục đích:

- nếu đơn đã ở trạng thái đóng thì không cho đổi trạng thái nữa.

Trạng thái đóng gồm:

- `completed`
- `cancelled`
- `rejected`
- `failed_delivery`
- `returned`

Ý nghĩa:

- bảo vệ vòng đời đơn hàng;
- tránh sửa lịch sử đơn đã kết thúc.

### 8.4 `trg_BeforeUpdate_OrderDetail_Immutable`

Chạy:

```sql
BEFORE UPDATE ON OrderDetail
```

Mục đích:

- chặn mọi thao tác update trên `OrderDetail`.

Ý nghĩa:

- chi tiết đơn hàng là dữ liệu lịch sử;
- không được sửa trực tiếp giá/số lượng sau khi đơn đã tạo.

### 8.5 `trg_BeforeDelete_Order_AntiHardDelete`

Chạy:

```sql
BEFORE DELETE ON Order
```

Mục đích:

- chặn xóa cứng đơn hàng.

Ý nghĩa:

- bảo vệ audit trail;
- muốn hủy đơn thì đổi status, không xóa row.

## 9. Function, Procedure Và View

### 9.1 Function `fn_FinalPrice`

Function:

```sql
fn_FinalPrice(p_price INT, p_discount INT)
```

Công thức:

```text
finalPrice = ROUND(price * (100 - discount) / 100)
```

Dùng để tính giá sau giảm giá. View `vw_ProductInventory` sử dụng function này để trả về `FinalPrice`.

### 9.2 Procedure `sp_UpdateInventory`

Input:

- `p_ProductID`
- `p_QuantityDelta`
- `p_Reason`
- `p_OrderID`

Procedure làm 2 việc:

1. Cập nhật `Inventory.StockQuantity`.
2. Ghi một dòng vào `InventoryLog`.

Nên cập nhật tồn kho thông qua procedure này để không mất lịch sử audit.

### 9.3 Procedure `sp_ProcessCancelRequest`

Input:

- `p_RequestID`
- `p_AdminID`
- `p_Status`
- `p_AdminReason`

Procedure:

- cập nhật trạng thái yêu cầu hủy;
- lưu lý do admin;
- set `ResolvedAt = NOW()`;
- set `ResolvedBy = admin id`.

### 9.4 View `vw_ProductInventory`

View này join:

- `Product`
- `Category`
- `Inventory`

Trả về:

- thông tin sản phẩm;
- tên danh mục;
- giá gốc;
- giá sau giảm;
- tồn kho;
- ngưỡng cảnh báo tồn kho thấp;
- trạng thái sản phẩm;
- thời gian tạo/cập nhật.

Backend dùng view này nhiều trong:

- danh sách sản phẩm;
- chi tiết sản phẩm;
- quản lý tồn kho.

### 9.5 View `vw_OrderPaymentSummary`

View này join:

- `Order`
- `Users`
- `Payment`
- `PaymentMethod`

Trả về:

- thông tin đơn hàng;
- thông tin user;
- số điện thoại;
- địa chỉ;
- tổng tiền;
- trạng thái đơn;
- phương thức thanh toán;
- trạng thái thanh toán;
- ngày thanh toán;
- thời gian tạo/cập nhật.

Backend dùng view này để list/detail order nhanh hơn.

## 10. Luồng Nghiệp Vụ Chính

### 10.1 Đăng Ký Và Đăng Nhập

Luồng:

```text
LoginRegisterPage
  -> AuthContext
  -> POST /auth/login hoặc POST /auth/register
  -> PHP kiểm tra database
  -> PHP set session
  -> Trả User về frontend
```

Sau khi đăng nhập:

- frontend lưu user vào `localStorage`;
- backend lưu session trong cookie;
- header và route admin/buyer cập nhật theo role.

### 10.2 Xem Sản Phẩm

Luồng:

```text
ProductListPage/ProductDetailPage
  -> GET /products hoặc GET /products/:id
  -> PHP query vw_ProductInventory
  -> MySQL tính FinalPrice bằng fn_FinalPrice
  -> PHP map row bằng product_row()
  -> React render sản phẩm
```

Danh sách sản phẩm hỗ trợ:

- tìm kiếm;
- lọc danh mục;
- lọc tình trạng;
- lọc sản phẩm sale;
- sort giá tăng/giảm, mới nhất/cũ nhất.

### 10.3 Thêm Giỏ Hàng

Luồng:

```text
ProductCard/ProductDetailPage
  -> CartContext.addToCart()
  -> POST /cart/items
  -> PHP tìm/tạo Cart theo UserID hoặc SessionID
  -> PHP kiểm tra tồn kho
  -> PHP trả giỏ hàng mới
```

Nếu quantity <= 0, frontend sẽ gọi xóa item khỏi giỏ.

### 10.4 Checkout Và Tạo Đơn

Luồng:

```text
CheckoutPage
  -> OrderContext.createOrder()
  -> POST /orders
  -> PHP begin transaction
  -> Insert Order
  -> Insert OrderDetail
  -> Trigger kiểm tra tồn kho
  -> Insert Payment
  -> CALL sp_UpdateInventory để trừ kho và ghi InventoryLog
  -> Update SoldQuantity
  -> Clear cart
  -> Commit
  -> Trả Order về frontend
```

Nếu số lượng vượt tồn kho:

- backend hoặc trigger sẽ báo lỗi;
- transaction rollback;
- đơn không được tạo.

### 10.5 Quản Lý Đơn Hàng Admin

Admin dùng:

- `GET /orders` để xem tất cả đơn;
- `PATCH /orders/:id/status` để đổi trạng thái đơn;
- `PATCH /orders/:id/payment` để đổi trạng thái thanh toán.

Database bảo vệ:

- trigger không cho đổi trạng thái đơn đã đóng;
- check constraint đảm bảo trạng thái payment và `PaymentDate` hợp lệ.

Admin xem chi tiết đơn sẽ có cảnh báo nếu:

- số điện thoại nằm trong blacklist;
- user nằm trong blacklist;
- user có status `Blacklist`.

### 10.6 Yêu Cầu Hủy Đơn

Buyer:

```text
MyOrdersPage
  -> POST /cancel-requests
```

Admin:

```text
OrderManagementPage
  -> PATCH /cancel-requests/:id/process
```

Khi admin xử lý:

- backend gọi `sp_ProcessCancelRequest`;
- lưu người xử lý;
- lưu thời gian xử lý;
- lưu lý do admin;
- nếu duyệt, backend có thể cập nhật order status và hoàn tồn kho theo logic hiện tại.

### 10.7 Quản Lý Tồn Kho

Luồng:

```text
InventoryManagementPage
  -> PATCH /inventory/:productId
  -> PHP require_admin()
  -> CALL sp_UpdateInventory
  -> MySQL update Inventory
  -> MySQL insert InventoryLog
  -> Trigger sync ProductStatus nếu cần
  -> Frontend refresh data
```

Ý nghĩa:

- mọi thay đổi tồn kho đều có log;
- sản phẩm tự chuyển `sold-out` nếu hết hàng.

### 10.8 Lịch Sử Giá

Khi admin sửa giá sản phẩm:

```text
ProductManagementPage
  -> PATCH /products/:id
  -> PHP lấy giá cũ
  -> Update Product
  -> Nếu giá thay đổi thì insert ProductPriceHistory
```

Frontend có thể xem lịch sử giá qua:

```text
GET /products/:id/price-history
```

### 10.9 Review

Buyer:

- tạo review bằng `POST /reviews`.

Public:

- chỉ hiển thị review `active`.

Admin:

- xem review bằng `GET /reviews?admin=1`;
- ẩn/hiện bằng `PATCH /reviews/:id/status`;
- xóa bằng `DELETE /reviews/:id`.

### 10.10 Báo Cáo

Backend có 3 endpoint báo cáo:

- `GET /reports/dashboard`
- `GET /reports/revenue`
- `GET /reports/categories`

Frontend admin dùng `recharts` để hiển thị doanh thu, lợi nhuận, đơn hàng và thống kê theo danh mục.

## 11. Phân Quyền MySQL

File:

```text
Web/database/permissions_2handworld.sql
```

Tạo 3 role:

- `role_2handworld_admin`
- `role_2handworld_buyer`
- `role_2handworld_guest`

Tạo 3 user:

- `admin_2handworld`@`localhost`
- `buyer_2handworld`@`localhost`
- `guest_2handworld`@`localhost`

Admin được:

- select/insert/update/delete toàn schema;
- execute function/procedure;
- quản lý trigger.

Buyer được:

- xem sản phẩm, danh mục, tồn kho, view public;
- cập nhật hồ sơ;
- CRUD giỏ hàng;
- tạo đơn;
- tạo yêu cầu hủy;
- tạo/cập nhật/xóa review theo quyền ứng dụng;
- execute `fn_FinalPrice`.

Guest được:

- xem dữ liệu public;
- đăng ký tài khoản;
- tạo đơn walk-in;
- dùng giỏ hàng guest;
- execute `fn_FinalPrice`.

Lưu ý: PHP hiện mặc định dùng tài khoản `root` nếu không set biến môi trường. Trong môi trường thật nên đổi sang user có quyền vừa đủ.

## 12. Test E2E

Test nằm trong:

```text
Web/fontend/tests/e2e/2handworld.spec.ts
```

Config nằm trong:

```text
Web/fontend/playwright.config.ts
```

Chạy test:

```bash
cd Web/fontend
npm run test:e2e
```

Playwright config:

- `testDir`: `./tests/e2e`
- `baseURL`: `http://127.0.0.1:5173`
- `headless`: false
- tự chạy dev server bằng `npm run dev -- --host 127.0.0.1 --port 5173`
- lưu trace/screenshot/video khi fail
- dùng custom reporter `status-reporter.ts`

Custom reporter đọc metadata từ tên test:

```text
[ID:...][EXPECT:...]
```

Sau đó in ra:

- ID test;
- mô tả;
- expected result;
- pass/fail;
- lý do fail nếu có.

Test hiện cover:

- trang public buyer;
- tìm kiếm/lọc/sắp xếp sản phẩm;
- login/logout/register;
- giỏ hàng;
- checkout;
- guest walk-in checkout;
- profile và đơn hàng của tôi;
- bảo mật API order/cancel/review;
- admin modules;
- CRUD sản phẩm;
- CRUD danh mục;
- VIP/blacklist user;
- quản lý tồn kho;
- báo cáo doanh thu;
- quản lý nội dung/cửa hàng;
- payment failed;
- xử lý yêu cầu hủy;
- cảnh báo blacklist;
- data propagation giữa API, buyer UI và admin UI.

## 13. Quy Ước ID Giữa Frontend Và Database

Backend map ID database thành string có prefix cho frontend:

- Product: `ProductID = 1` -> `p1`
- Category: `CategoryID = 2` -> `c2`
- Order: `OrderID = 3` -> `o3`
- User: `UserID = 4` -> `u4`

Khi nhận request, backend dùng:

```php
int_id($value, $prefix)
```

để cắt prefix và validate ID.

Ví dụ:

- frontend gửi `p12`;
- backend gọi `int_id('p12', 'p')`;
- kết quả là integer `12`.

Nếu ID sai format hoặc <= 0, backend trả lỗi `422`.

## 14. Những Điểm Cần Chú Ý Khi Sửa Code

### 14.1 Sửa Status Phải Sửa Đồng Bộ

Các status như order status, payment status, user status xuất hiện ở nhiều nơi:

- TypeScript types;
- UI label/filter;
- backend mapper/validation;
- MySQL check constraint;
- trigger;
- seed data;
- E2E test.

Nếu sửa một nơi mà quên nơi khác, hệ thống rất dễ lỗi.

### 14.2 Không Update Trực Tiếp `OrderDetail`

Database có trigger chặn update `OrderDetail`. Đây là thiết kế đúng vì chi tiết đơn hàng là dữ liệu lịch sử.

Nếu cần xử lý thay đổi sau khi đặt hàng, nên tạo nghiệp vụ hủy, hoàn, trả hàng hoặc tạo order adjustment, không sửa trực tiếp row cũ.

### 14.3 Không Delete Cứng `Order`

Trigger chặn delete order. Muốn hủy hoặc từ chối đơn thì cập nhật status:

- `cancelled`
- `rejected`
- `returned`
- `failed_delivery`

### 14.4 Tồn Kho Nên Đi Qua `sp_UpdateInventory`

Nếu update `Inventory` trực tiếp, có thể bỏ lỡ `InventoryLog`.

Nên dùng:

```sql
CALL sp_UpdateInventory(...);
```

để vừa cập nhật tồn kho vừa ghi log.

### 14.5 Giá Hiển Thị Nên Lấy Từ View

View `vw_ProductInventory` đã tính `FinalPrice` bằng `fn_FinalPrice`. Backend map:

- `price`: giá sau giảm;
- `originalPrice`: giá gốc nếu có giảm giá.

### 14.6 CORS Phụ Thuộc Port Frontend

Backend hiện chỉ cho phép:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Nếu đổi port hoặc domain frontend, cần sửa CORS trong `index.php`.

### 14.7 Tên Thư Mục Là `fontend`

Thư mục hiện tại đang viết là:

```text
Web/fontend
```

không phải `Web/frontend`. Khi chạy command hoặc viết path phải dùng đúng tên này.

## 15. Tóm Tắt Một Số Luồng Quan Trọng

### Buyer Checkout

```text
1. Buyer mở /san-pham
2. React gọi GET /products
3. PHP query vw_ProductInventory
4. MySQL tính FinalPrice bằng fn_FinalPrice
5. React render ProductCard
6. Buyer bấm thêm giỏ
7. React gọi POST /cart/items
8. PHP tạo/tìm Cart theo UserID hoặc SessionID
9. Buyer checkout
10. React gọi POST /orders
11. PHP begin transaction
12. Insert Order
13. Insert OrderDetail
14. Trigger kiểm tra tồn kho
15. Insert Payment
16. CALL sp_UpdateInventory để trừ kho và ghi InventoryLog
17. Trigger sync ProductStatus nếu stock về 0
18. PHP commit
19. React clear cart/refresh products/orders
```

### Admin Cập Nhật Tồn Kho

```text
1. Admin mở /admin/ton-kho
2. React gọi GET /inventory
3. PHP lấy dữ liệu từ vw_ProductInventory
4. Admin nhập delta stock
5. React gọi PATCH /inventory/:productId
6. PHP require_admin()
7. PHP CALL sp_UpdateInventory
8. MySQL update Inventory và insert InventoryLog
9. Trigger sync ProductStatus nếu cần
10. React refresh data
```

### Admin Đổi Trạng Thái Đơn

```text
1. Admin mở /admin/don-hang
2. React gọi GET /orders
3. PHP lấy order summary và order detail
4. Admin đổi status
5. React gọi PATCH /orders/:id/status
6. PHP require_admin()
7. MySQL trigger chặn nếu order đã đóng
8. PHP trả order mới
9. React refresh list
```

## 16. Thứ Tự Nên Đọc Code

Nếu muốn hiểu dự án từ dễ đến khó, nên đọc theo thứ tự:

1. `Web/fontend/src/App.tsx`
2. `Web/fontend/src/services/api.ts`
3. `Web/fontend/src/contexts/AuthContext.tsx`
4. `Web/fontend/src/contexts/CartContext.tsx`
5. `Web/fontend/src/contexts/OrderContext.tsx`
6. `Web/backend/config/database.php`
7. `Web/backend/api/index.php`
8. `Web/database/DB_2handworld_Update.sql`
9. `Web/database/routines_views_2handworld.sql`
10. `Web/database/permissions_2handworld.sql`
11. `Web/fontend/tests/e2e/2handworld.spec.ts`

Đọc theo thứ tự này sẽ thấy được toàn bộ đường đi của dữ liệu: từ UI, qua API, xuống database, rồi quay lại UI và test.
