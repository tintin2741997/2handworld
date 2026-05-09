# Kịch bản demo website 2HANDWORLD

## 1. Mục tiêu demo

Giới thiệu website 2HANDWORLD như một nền tảng bán đồ thời trang secondhand, hỗ trợ người mua tìm sản phẩm, xem chi tiết, thêm vào giỏ hàng, đặt hàng và hỗ trợ quản trị viên quản lý sản phẩm, đơn hàng, doanh thu, người dùng, tồn kho.

Thời lượng gợi ý: 8-12 phút.

## 2. Chuẩn bị trước khi demo

Mở terminal tại thư mục dự án:

```bat
cd C:\xampp\htdocs\2handworld
npm run dev
```

Mở trình duyệt:

```text
http://127.0.0.1:5173
```

Nếu cần import lại database demo:

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

## 3. Lời mở đầu

Xin chào thầy/cô và các bạn. Hôm nay em xin demo website 2HANDWORLD, một hệ thống thương mại điện tử dành cho thời trang secondhand.

Ý tưởng chính của website là giúp người dùng mua các sản phẩm đã qua sử dụng nhưng vẫn đảm bảo chất lượng, có thông tin rõ ràng về tình trạng sản phẩm, giá bán, đánh giá, số lượng tồn và cửa hàng. Bên cạnh giao diện mua hàng, hệ thống còn có khu vực quản trị để theo dõi sản phẩm, đơn hàng, doanh thu, người dùng và tồn kho.

## 4. Demo phía người mua

### Bước 1: Trang chủ

Thao tác:

1. Mở `http://127.0.0.1:5173`.
2. Giới thiệu banner chính "2HAND WORLD - Phong cách bền vững".
3. Chỉ vào các điểm nổi bật: chất lượng đảm bảo, giá hợp lý, đổi trả dễ dàng, giao hàng nhanh.
4. Cuộn xuống các khu vực danh mục, sản phẩm mới và sản phẩm đang giảm giá.

Lời thoại gợi ý:

Đầu tiên là trang chủ. Trang này đóng vai trò giới thiệu nhanh thương hiệu và điều hướng người dùng đến sản phẩm. Người mua có thể thấy các cam kết chính của cửa hàng như sản phẩm được tuyển chọn, giá tiết kiệm, đổi trả trong 3 ngày và giao hàng toàn quốc. Bên dưới là các danh mục nổi bật, sản phẩm mới và các sản phẩm đang giảm giá để tăng khả năng khám phá.

### Bước 2: Danh sách sản phẩm

Thao tác:

1. Bấm "Khám phá ngay" hoặc vào menu "Sản phẩm".
2. Demo bộ lọc theo danh mục, tình trạng, cửa hàng hoặc khoảng giá.
3. Demo sắp xếp theo "Giá thấp đến cao", "Giá cao đến thấp" hoặc "Đánh giá cao nhất".
4. Chọn một sản phẩm bất kỳ để xem chi tiết.

Lời thoại gợi ý:

Đây là trang danh sách sản phẩm. Người dùng có thể lọc sản phẩm theo nhiều tiêu chí như danh mục, tình trạng sản phẩm, cửa hàng và giá. Ngoài ra còn có chức năng sắp xếp, giúp người dùng nhanh chóng tìm món phù hợp với ngân sách hoặc ưu tiên sản phẩm được đánh giá cao.

### Bước 3: Chi tiết sản phẩm

Thao tác:

1. Mở một sản phẩm, ví dụ "Áo Sơ Mi Linen Trắng Vintage".
2. Giới thiệu ảnh sản phẩm, tình trạng, giá, giá gốc nếu đang giảm, đánh giá và số lượng còn lại.
3. Chuyển các tab "Mô tả chi tiết", "Đánh giá", "Biến động giá".
4. Chọn số lượng và bấm "Thêm vào giỏ".

Lời thoại gợi ý:

Trang chi tiết sản phẩm cung cấp đầy đủ thông tin để người mua ra quyết định. Vì đây là đồ secondhand nên hệ thống hiển thị rõ tình trạng sản phẩm, mô tả, giá bán, đánh giá và chính sách đổi trả. Điểm đáng chú ý là tab biến động giá, giúp người dùng theo dõi lịch sử thay đổi giá của sản phẩm, từ đó tăng tính minh bạch.

### Bước 4: Giỏ hàng

Thao tác:

1. Bấm biểu tượng giỏ hàng hoặc vào `/gio-hang`.
2. Kiểm tra sản phẩm trong giỏ.
3. Tăng/giảm số lượng nếu cần.
4. Bấm thanh toán.

Lời thoại gợi ý:

Sau khi thêm sản phẩm, người dùng có thể xem lại giỏ hàng. Tại đây hệ thống hiển thị danh sách sản phẩm, số lượng, giá và tổng tiền. Người dùng có thể điều chỉnh số lượng hoặc xóa sản phẩm trước khi tiến hành thanh toán.

### Bước 5: Thanh toán

Thao tác:

1. Nhập thông tin nhận hàng:
   - Họ tên: Nguyễn Văn A
   - Số điện thoại: 0901112222
   - Email: nguyenvana@gmail.com
   - Địa chỉ: 123 Lê Lợi
   - Thành phố: Hồ Chí Minh
   - Quận: Quận 1
   - Phường: Phường 1
2. Bấm "Tiếp tục thanh toán".
3. Chọn phương thức thanh toán COD hoặc chuyển khoản.
4. Bấm "Xem lại đơn hàng".
5. Bấm "Xác nhận đặt hàng".

Lời thoại gợi ý:

Quy trình thanh toán được chia thành 3 bước: nhập thông tin nhận hàng, chọn phương thức thanh toán và xác nhận đơn hàng. Cách chia bước này giúp người dùng kiểm tra lại thông tin trước khi đặt hàng. Sau khi xác nhận, hệ thống tạo đơn hàng và hiển thị thông báo đặt hàng thành công.

## 5. Demo tài khoản người dùng

Thao tác:

1. Vào "Đăng nhập".
2. Đăng nhập bằng tài khoản buyer:

```text
nguyenvana@gmail.com / 123456
```

3. Mở trang hồ sơ hoặc đơn hàng.
4. Giới thiệu khả năng xem thông tin cá nhân và lịch sử đơn hàng.

Lời thoại gợi ý:

Ngoài mua hàng nhanh, người dùng có thể đăng nhập để quản lý thông tin cá nhân và xem lại lịch sử đơn hàng. Điều này giúp trải nghiệm mua sắm liền mạch hơn, đặc biệt với khách hàng quay lại nhiều lần.

## 6. Demo phía quản trị viên

### Bước 1: Đăng nhập admin

Thao tác:

1. Đăng xuất tài khoản người mua nếu đang đăng nhập.
2. Vào trang đăng nhập.
3. Đăng nhập:

```text
admin@2hand.vn / admin123
```

4. Mở `/admin`.

Lời thoại gợi ý:

Bây giờ em chuyển sang khu vực quản trị. Đây là nơi nhân viên hoặc admin theo dõi toàn bộ hoạt động của cửa hàng, từ sản phẩm đến đơn hàng và doanh thu.

### Bước 2: Dashboard

Thao tác:

1. Mở trang `/admin`.
2. Giới thiệu các chỉ số tổng quan: sản phẩm, danh mục, đơn hàng, doanh thu, lợi nhuận.

Lời thoại gợi ý:

Dashboard cho admin cái nhìn tổng quan về tình hình kinh doanh. Các chỉ số này giúp quản trị viên nắm nhanh số lượng sản phẩm, đơn hàng và hiệu quả doanh thu.

### Bước 3: Quản lý sản phẩm và danh mục

Thao tác:

1. Vào "Sản phẩm".
2. Giới thiệu danh sách sản phẩm, trạng thái, giá, tồn kho.
3. Vào "Danh mục".
4. Giới thiệu quản lý nhóm sản phẩm như áo, quần, váy, giày dép, túi xách, phụ kiện.

Lời thoại gợi ý:

Khu vực quản lý sản phẩm cho phép admin theo dõi các mặt hàng đang bán. Với đồ secondhand, số lượng tồn thường thấp, nhiều sản phẩm chỉ có một vài món, nên việc quản lý tồn kho và tình trạng sản phẩm rất quan trọng.

### Bước 4: Quản lý đơn hàng

Thao tác:

1. Vào "Đơn hàng".
2. Chỉ các trạng thái như chờ xử lý, đã xác nhận, đang giao, hoàn thành, đã hủy.
3. Nếu có chức năng cập nhật trạng thái, demo cập nhật trạng thái đơn hàng.

Lời thoại gợi ý:

Trang đơn hàng giúp admin theo dõi quá trình xử lý đơn. Mỗi đơn có thông tin khách hàng, sản phẩm, phương thức thanh toán và trạng thái. Nhờ đó cửa hàng có thể xử lý đơn hàng từ lúc tiếp nhận đến khi giao thành công.

### Bước 5: Doanh thu, đánh giá, người dùng, tồn kho

Thao tác:

1. Vào "Doanh thu" để giới thiệu báo cáo.
2. Vào "Đánh giá" để giới thiệu quản lý phản hồi.
3. Vào "Người dùng" để giới thiệu khách thường, VIP và blacklist.
4. Vào "Tồn kho" để giới thiệu kiểm soát số lượng sản phẩm.

Lời thoại gợi ý:

Ngoài vận hành đơn hàng, admin còn có các trang hỗ trợ quản trị nâng cao. Báo cáo doanh thu giúp theo dõi hiệu quả kinh doanh. Quản lý đánh giá giúp kiểm soát chất lượng dịch vụ. Quản lý người dùng hỗ trợ phân loại khách hàng, bao gồm khách VIP và khách bị blacklist. Cuối cùng, tồn kho giúp tránh tình trạng bán vượt số lượng thực tế.

## 7. Kịch bản demo nhanh 5 phút

Nếu thời gian bị giới hạn, demo theo thứ tự sau:

1. Trang chủ: giới thiệu mục tiêu website và các điểm nổi bật.
2. Sản phẩm: lọc/sắp xếp và mở chi tiết một sản phẩm.
3. Chi tiết sản phẩm: thêm vào giỏ, nhấn mạnh tình trạng sản phẩm và biến động giá.
4. Thanh toán: đi qua 3 bước đặt hàng.
5. Admin: mở dashboard, đơn hàng, tồn kho và doanh thu.

## 8. Kết luận

Qua phần demo, website 2HANDWORLD đã thể hiện được hai nhóm chức năng chính. Với người mua, hệ thống hỗ trợ tìm kiếm, lọc sản phẩm, xem chi tiết, thêm vào giỏ và đặt hàng. Với quản trị viên, hệ thống hỗ trợ quản lý sản phẩm, danh mục, đơn hàng, doanh thu, đánh giá, người dùng và tồn kho.

Hướng phát triển tiếp theo có thể là tích hợp thanh toán online thực tế, bản đồ cửa hàng, gợi ý sản phẩm theo hành vi người dùng và hệ thống thông báo trạng thái đơn hàng qua email hoặc SMS.

## 9. Checklist trước khi thuyết trình

- XAMPP/MySQL đang chạy.
- Database `2handworld_schema` đã được import.
- Chạy được `npm run dev`.
- Mở được `http://127.0.0.1:5173`.
- Đăng nhập được tài khoản buyer.
- Đăng nhập được tài khoản admin.
- Có ít nhất một sản phẩm trong giỏ để demo thanh toán.
- Trình duyệt zoom khoảng 90-100% để giao diện hiển thị đẹp.

## 10. Phương án dự phòng khi lỗi

- Nếu backend/database lỗi: demo giao diện frontend, nói rõ dữ liệu demo có thể lấy từ mock data hoặc database.
- Nếu đăng nhập lỗi: truy cập trực tiếp các trang public trước, sau đó demo admin bằng đường dẫn `/admin` nếu hệ thống vẫn cho hiển thị.
- Nếu đặt hàng lỗi: dừng tại bước xác nhận đơn hàng và giải thích đây là bước cuối gửi dữ liệu lên backend tạo đơn.
- Nếu ảnh sản phẩm tải chậm: tập trung trình bày luồng chức năng, vì ảnh đang dùng nguồn demo online.
