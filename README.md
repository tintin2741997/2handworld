# 2HANDWORLD - Note

## 1. Các yêu cầu đã xử lý

- Bổ sung phân quyền ở cấp độ database.
- Làm rõ mapping giữa `User` và `Role`.
- Bổ sung view phân quyền cho từng nhóm người dùng.
- Bổ sung xuất báo cáo doanh thu ra Excel `.xlsx`.
- Bổ sung xuất báo cáo doanh thu ra PDF.
- Bổ sung báo cáo doanh thu theo từng sản phẩm.
- Bổ sung tra cứu lịch sử mua hàng cho Guest.
- Tối ưu báo cáo doanh thu bằng cách tính tổng từ chi tiết đơn hàng.

## 2. Mapping User và Role

Version trước đây hệ thống chủ yếu dựa vào cột:

```sql
Users.Role
```

Cách này vẫn chạy được nhưng chưa thể hiện rõ mô hình phân quyền ở tầng database. Vì vậy database đã bổ sung hai bảng:

```sql
Roles
UserRoles
```

Ý nghĩa:

- `Roles`: lưu danh sách quyền trong hệ thống, hiện có `admin`, `buyer`, `guest`.
- `UserRoles`: bảng trung gian để gán user với role.

Ví dụ:

| UserID | RoleID | Ý nghĩa |
|---|---|---|
| 1 | 1 | User 1 là admin |
| 2 | 2 | User 2 là buyer |
| 3 | 2 | User 3 là buyer |

Lý do cần mapping `UserRoles`:

- Không hardcode một tài khoản admin duy nhất.
- Có thể có nhiều admin hoặc nhiều buyer.
- Có thể mở rộng một user có nhiều role nếu hệ thống phát triển thêm.
- Việc phân quyền được thể hiện rõ trong thiết kế database.

Backend hiện ưu tiên đọc quyền từ:

```sql
UserRoles + Roles
```

Nếu database cũ chưa có bảng mapping, backend vẫn fallback về:

```sql
Users.Role
```

để tránh lỗi khi chạy dữ liệu cũ.

## 3. View phân quyền trong database

Đã bổ sung các view để mỗi nhóm người dùng nhìn thấy dữ liệu phù hợp.

```sql
vw_GuestProductCatalog
vw_BuyerProductCatalog
vw_AdminProductCatalog
vw_BuyerOrderHistory
vw_GuestOrderLookup
vw_ProductInventory
vw_OrderPaymentSummary
```

Giải thích nhanh:

- `vw_GuestProductCatalog`: dữ liệu sản phẩm công khai cho khách chưa đăng nhập.
- `vw_BuyerProductCatalog`: dữ liệu sản phẩm cho buyer đã đăng nhập.
- `vw_AdminProductCatalog`: dữ liệu đầy đủ cho admin.
- `vw_BuyerOrderHistory`: lịch sử đơn hàng của buyer.
- `vw_GuestOrderLookup`: tra cứu đơn hàng guest bằng số điện thoại.
- `vw_OrderPaymentSummary`: gom thông tin đơn hàng, thanh toán và tổng tiền tính toán.

Mục đích:

- Không chỉ ẩn/hiện nút ở frontend.
- Có phân quyền dữ liệu ngay trong database.
- Dễ giải thích trong báo cáo môn Quản trị cơ sở dữ liệu.

## 4. Tính doanh thu và tổng tiền

Báo cáo doanh thu không phụ thuộc hoàn toàn vào cột `Order.TotalAmount`.

View `vw_OrderPaymentSummary` có thêm:

```sql
CalculatedTotalAmount
```

Giá trị này được tính từ:

```sql
SUM(OrderDetail.Price * OrderDetail.Quantity)
```

Lý do:

- Tránh dư thừa dữ liệu.
- Hạn chế sai lệch giữa tổng tiền lưu trong đơn và chi tiết đơn hàng.
- Phù hợp về tối ưu lưu trữ tính toán.

## 5. Báo cáo doanh thu theo sản phẩm

Đã bổ sung endpoint:

```text
GET /reports/products
```

Endpoint này trả dữ liệu theo từng sản phẩm:

- Tên sản phẩm.
- Danh mục.
- Số lượng bán.
- Giá bán trung bình.
- Doanh thu.
- Lợi nhuận.

Quan trọng:

- Doanh thu từng món hàng lấy từ `/reports/products`.
- Không dùng `/reports/categories` để hiểu là doanh thu từng sản phẩm.
- `/reports/categories` chỉ dùng để xem cơ cấu doanh thu theo danh mục.
- Chỉ tính các đơn có trạng thái `completed`.

## 6. Note cho người dùng Admin

Các tính năng hiện có trong menu Admin.

### Menu Admin

- `Dashboard`: xem tổng quan sản phẩm, danh mục, đơn hàng, doanh thu và lợi nhuận.
- `Báo cáo doanh thu`: xem biểu đồ doanh thu/lợi nhuận, bảng doanh thu theo sản phẩm, bảng doanh thu theo danh mục.
- `Quản lý đơn hàng`: cập nhật trạng thái đơn hàng và thanh toán.
- `Quản lý sản phẩm`: quản lý thông tin sản phẩm, giá bán, giá nhập, trạng thái sản phẩm.
- `Quản lý tồn kho`: cập nhật số lượng tồn và ngưỡng cảnh báo.
- `Quản lý người dùng`: xem buyer, trạng thái tài khoản và blacklist.

### Xuất Excel

Trong menu `Báo cáo doanh thu`, nút `Xuất Excel` dùng để tải file `.xlsx`.

File Excel gồm:

- Sheet tổng quan doanh thu.
- Sheet doanh thu theo từng sản phẩm.
- Sheet doanh thu theo danh mục.

### Xuất PDF

Trong menu `Báo cáo doanh thu`, nút `Xuất PDF` dùng để tải file PDF.

File PDF hiển thị:

- Thông tin cửa hàng.
- Tổng quan doanh thu.
- Bảng doanh thu theo từng sản phẩm.

## 7. Lịch sử mua hàng Guest

Đã bổ sung endpoint:

```text
GET /orders/guest-history?phone=...
```

Ý nghĩa:

- Buyer đăng nhập xem đơn hàng theo tài khoản.
- Guest chưa đăng nhập có thể tra cứu đơn hàng bằng số điện thoại đã đặt.

View liên quan:

```sql
vw_GuestOrderLookup
```

## 9. File quan trọng đã thay đổi

Database:

```text
Web/database/xampp_teacher_feedback_update.sql
Web/database/xampp_permissions_optional.sql
Web/database/README.md
Web/database/DB_2handworld_Update.sql
Web/database/routines_views_2handworld.sql
Web/database/permissions_2handworld.sql
```

Backend:

```text
Web/backend/api/index.php
```

Frontend:

```text
Web/fontend/src/pages/admin/RevenueReportPage.tsx
Web/fontend/src/pages/account/MyOrdersPage.tsx
Web/fontend/package.json
Web/fontend/package-lock.json

