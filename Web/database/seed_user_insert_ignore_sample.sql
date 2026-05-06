USE `2handworld_schema`;

-- Bo du lieu mau do nguoi dung cung cap.
-- Dung INSERT IGNORE de neu trung khoa chinh/unique thi bo qua,
-- khong ghi de du lieu hien co trong CSDL.

INSERT IGNORE INTO `Users` (`UserID`, `Username`, `Email`, `PhoneNumber`, `Password`, `Address`, `Status`, `Role`) VALUES
(1,'Admin','admin@2hand.vn','0999999999','<bcrypt_admin>','2HANDWORLD Office',NULL,'admin'),
(2,'Nguyễn Văn A','nguyenvana@gmail.com','0901112222','<bcrypt_123456>','123 Lê Lợi, Q.1, TP.HCM','Normal','buyer'),
(3,'Trần Thị B','tranthib@gmail.com','0903334444','<bcrypt_123456>','456 Nguyễn Huệ, Q.1, TP.HCM','VIP','buyer'),
(4,'Lê Hoàng C','lehoangc@gmail.com','0905556666','<bcrypt_123456>','12 CMT8, TP.HCM','Blacklist','buyer'),
(5,'Phạm Minh D','phamminhd@gmail.com','0907778888','<bcrypt_123456>','88 Trần Hưng Đạo, TP.HCM','Normal','buyer'),
(6,'Đỗ Anh E','doanhe@gmail.com','0911112222','<bcrypt_123456>','25 Nguyễn Trãi, TP.HCM','Normal','buyer'),
(7,'Võ Thành F','vothanhf@gmail.com','0913334444','<bcrypt_123456>','9 Pasteur, TP.HCM','VIP','buyer'),
(8,'Bùi Kim G','buikimg@gmail.com','0915556666','<bcrypt_123456>','17 Cách Mạng Tháng 8, TP.HCM','Normal','buyer'),
(9,'Huỳnh Như H','huynhnhuh@gmail.com','0917778888','<bcrypt_123456>','41 Lý Tự Trọng, TP.HCM','Normal','buyer'),
(10,'Đặng Quốc I','dangquoci@gmail.com','0921112222','<bcrypt_123456>','72 Điện Biên Phủ, TP.HCM','Normal','buyer');

INSERT IGNORE INTO `Category` (`CategoryID`, `CategoryName`) VALUES
(1,'Áo'),(2,'Quần'),(3,'Váy/Đầm'),(4,'Giày dép'),(5,'Túi xách'),
(6,'Phụ kiện'),(7,'Sách'),(8,'Đồ điện tử'),(9,'Đồ gia dụng'),(10,'Đồ decor');

INSERT IGNORE INTO `Product` (`ProductID`,`CategoryID`,`ProductName`,`ProductImage`,`Price`,`ImportPrice`,`Description`,`Condition`,`SoldQuantity`,`ProductStatus`,`DiscountPercent`) VALUES
(1,1,'Áo Sơ Mi Linen Trắng Vintage','https://loremflickr.com/800/800/white,linen,shirt/all?lock=2001',250000,90000,'Áo sơ mi linen phong cách vintage.','Như mới',3,'active',40),
(2,2,'Quần Jeans Levis 501 Xanh Đậm','https://loremflickr.com/800/800/blue,jeans/all?lock=2002',350000,180000,'Quần jeans form đứng, độ mới 90%.','Tot',2,'active',0),
(3,3,'Đầm Hoa Nhí Dáng Dài Mùa Thu','https://loremflickr.com/800/800/floral,dress/all?lock=2003',220000,100000,'Đầm hoa nhí phong cách Hàn Quốc.','Như mới',1,'active',18),
(4,5,'Túi Xách Da Thật Đeo Chéo Retro','https://loremflickr.com/800/800/brown,leather,bag/all?lock=2004',450000,240000,'Túi da thật màu nâu vintage.','Khá',2,'active',0),
(5,1,'Áo Khoác Blazer Kẻ Caro Oversize','https://loremflickr.com/800/800/plaid,blazer/all?lock=2005',300000,140000,'Blazer form rộng họa tiết caro.','Tot',1,'active',26),
(6,4,'Giày Oxford Da Nữ Cổ Điển','https://loremflickr.com/800/800/oxford,shoes/all?lock=2006',280000,120000,'Giày oxford da size 37.','Trung bình',0,'active',0),
(7,3,'Chân Váy Midi Xếp Ly Màu Be','https://loremflickr.com/800/800/pleated,skirt/all?lock=2007',120000,50000,'Chân váy xếp ly dáng dài.','Như mới',4,'active',0),
(8,6,'Đồng Hồ Dây Da Mặt Vuông Vintage','https://loremflickr.com/800/800/square,wristwatch/all?lock=2008',400000,210000,'Đồng hồ nữ mặt vuông máy quartz.','Tot',1,'active',20),
(9,8,'Máy Ảnh Film Mini Đã Qua Sử Dụng','https://loremflickr.com/800/800/vintage,film,camera/all?lock=2009',650000,350000,'Máy ảnh film mini đã test.','Khá',0,'active',10),
(10,7,'Sách Thiết Kế UI UX Căn Bản','https://loremflickr.com/800/800/ui,ux,design,book/all?lock=2010',90000,30000,'Sách còn mới, đầy đủ trang.','Tot',0,'active',0);

INSERT IGNORE INTO `Inventory` (`InventoryID`,`ProductID`,`StockQuantity`,`LowStockThreshold`) VALUES
(1,1,2,3),(2,2,1,3),(3,3,3,3),(4,4,1,3),(5,5,1,3),
(6,6,1,3),(7,7,4,3),(8,8,1,3),(9,9,2,2),(10,10,5,2);

INSERT IGNORE INTO `PaymentMethod` (`MethodID`,`MethodName`) VALUES
(1,'COD'),(2,'Bank'),(3,'Trực tiếp tại cửa hàng');

INSERT IGNORE INTO `Blacklist` (`BlacklistID`,`UserID`,`PhoneNumber`,`Reason`,`CreatedAt`) VALUES
(1,4,'0905556666','Bom hàng 3 lần liên tiếp','2026-03-01 10:00:00'),
(2,NULL,'0980000001','Số điện thoại đặt hàng ảo','2026-03-02 10:00:00'),
(3,NULL,'0980000002','Không nhận hàng nhiều lần','2026-03-03 10:00:00'),
(4,NULL,'0980000003','Địa chỉ giao hàng không hợp lệ','2026-03-04 10:00:00'),
(5,NULL,'0980000004','Yêu cầu hủy đơn liên tục','2026-03-05 10:00:00'),
(6,NULL,'0980000005','Thông tin người nhận không rõ','2026-03-06 10:00:00'),
(7,NULL,'0980000006','Từ chối thanh toán COD','2026-03-07 10:00:00'),
(8,NULL,'0980000007','Đơn hàng có dấu hiệu rủi ro','2026-03-08 10:00:00'),
(9,NULL,'0980000008','Không liên lạc được khi giao hàng','2026-03-09 10:00:00'),
(10,NULL,'0980000009','Bị admin đánh dấu kiểm tra','2026-03-10 10:00:00');

INSERT IGNORE INTO `Cart` (`CartID`,`UserID`,`SessionID`) VALUES
(1,2,'sess_u2'),(2,3,'sess_u3'),(3,5,'sess_u5'),(4,6,'sess_u6'),(5,7,'sess_u7'),
(6,NULL,'guest_a'),(7,NULL,'guest_b'),(8,NULL,'guest_c'),(9,8,'sess_u8'),(10,9,'sess_u9');

INSERT IGNORE INTO `CartItems` (`CartItemsID`,`CartID`,`ProductID`,`Quantity`) VALUES
(1,1,1,1),(2,1,2,1),(3,2,3,1),(4,3,4,1),(5,4,5,1),
(6,5,6,1),(7,6,7,2),(8,7,8,1),(9,8,9,1),(10,9,10,1);

INSERT IGNORE INTO `Order` (`OrderID`,`UserID`,`OrderDate`,`TotalAmount`,`Status`,`PhoneNumber`,`Address`,`CreatedAt`,`UpdatedAt`) VALUES
(1,2,'2026-01-12 09:15:00',180000,'Hoàn thành','0901112222','123 Lê Lợi, Q.1','2026-01-12 09:15:00','2026-01-14 16:30:00'),
(2,3,'2026-02-08 14:20:00',530000,'Hoàn thành','0903334444','456 Nguyễn Huệ, Q.1','2026-02-08 14:20:00','2026-02-10 11:00:00'),
(3,2,'2026-03-18 10:05:00',480000,'Hoàn thành','0901112222','123 Lê Lợi, Q.1','2026-03-18 10:05:00','2026-03-20 15:45:00'),
(4,3,'2026-04-20 08:40:00',270000,'Chưa xác nhận','0903334444','456 Nguyễn Huệ, Q.1','2026-04-20 08:40:00','2026-04-20 08:40:00'),
(5,5,'2026-04-21 09:00:00',300000,'Đã xác nhận','0907778888','88 Trần Hưng Đạo','2026-04-21 09:00:00','2026-04-21 10:00:00'),
(6,6,'2026-04-22 10:00:00',280000,'Đang giao','0911112222','25 Nguyễn Trãi','2026-04-22 10:00:00','2026-04-23 08:00:00'),
(7,7,'2026-04-23 11:00:00',400000,'Hoàn thành','0913334444','9 Pasteur','2026-04-23 11:00:00','2026-04-24 16:00:00'),
(8,NULL,'2026-04-24 12:00:00',90000,'Chưa xác nhận','0930000001','Địa chỉ khách 1','2026-04-24 12:00:00','2026-04-24 12:00:00'),
(9,8,'2026-04-25 13:00:00',650000,'Bị từ chối','0915556666','17 CMT8','2026-04-25 13:00:00','2026-04-25 15:00:00'),
(10,9,'2026-04-26 14:00:00',120000,'Đã hủy','0917778888','41 Lý Tự Trọng','2026-04-26 14:00:00','2026-04-26 16:00:00');

INSERT IGNORE INTO `OrderDetail` (`OrderID`,`ProductID`,`Quantity`,`Price`) VALUES
(1,1,1,150000),(2,2,1,350000),(2,3,1,180000),(3,4,1,450000),(4,7,2,120000),
(5,5,1,222000),(6,6,1,280000),(7,8,1,320000),(8,10,1,90000),(9,9,1,585000);

INSERT IGNORE INTO `Payment` (`PaymentID`,`OrderID`,`MethodID`,`Status`,`PaymentDate`) VALUES
(1,1,1,'Đã thanh toán','2026-01-14 16:30:00'),(2,2,2,'Đã thanh toán','2026-02-08 14:30:00'),
(3,3,1,'Đã thanh toán','2026-03-20 15:45:00'),(4,4,1,'Chưa thanh toán',NULL),
(5,5,2,'Chưa thanh toán',NULL),(6,6,1,'Chưa thanh toán',NULL),(7,7,2,'Đã thanh toán','2026-04-23 11:05:00'),
(8,8,1,'Chưa thanh toán',NULL),(9,9,1,'Thanh toán thất bại',NULL),(10,10,1,'Đã hoàn tiền','2026-04-26 16:10:00');

INSERT IGNORE INTO `InventoryLog` (`LogID`,`ProductID`,`OrderID`,`ChangeQuantity`,`Reason`,`LogDate`) VALUES
(1,1,NULL,5,'Nhập hàng','2026-01-01 08:00:00'),(2,2,NULL,4,'Nhập hàng','2026-01-01 08:10:00'),
(3,3,NULL,4,'Nhập hàng','2026-01-01 08:20:00'),(4,1,1,-1,'Xuất bán','2026-01-12 09:20:00'),
(5,2,2,-1,'Xuất bán','2026-02-08 14:25:00'),(6,3,2,-1,'Xuất bán','2026-02-08 14:25:00'),
(7,4,3,-1,'Xuất bán','2026-03-18 10:10:00'),(8,7,4,-2,'Xuất bán','2026-04-20 08:45:00'),
(9,9,NULL,2,'Nhập hàng','2026-04-22 09:00:00'),(10,10,NULL,5,'Nhập hàng','2026-04-22 09:30:00');

INSERT IGNORE INTO `CancelRequest` (`RequestID`,`OrderID`,`UserID`,`ReasonBuyer`,`ReasonAdmin`,`Status`,`CreatedAt`,`ResolvedAt`,`ResolvedBy`) VALUES
(1,10,9,'Đặt nhầm sản phẩm','Admin đồng ý hủy','Approved','2026-04-26 14:30:00','2026-04-26 16:00:00',1),
(2,4,3,'Muốn đổi địa chỉ',NULL,'Pending','2026-04-20 09:00:00',NULL,NULL),
(3,5,5,'Không còn nhu cầu',NULL,'Pending','2026-04-21 11:00:00',NULL,NULL),
(4,6,6,'Đặt trùng đơn','Admin từ chối vì đang giao','Rejected','2026-04-22 12:00:00','2026-04-22 13:00:00',1),
(5,7,7,'Muốn đổi phương thức thanh toán',NULL,'Pending','2026-04-23 12:00:00',NULL,NULL),
(6,8,2,'Thay đổi thông tin nhận hàng',NULL,'Pending','2026-04-24 13:00:00',NULL,NULL),
(7,9,8,'Không liên lạc được',NULL,'Pending','2026-04-25 14:00:00',NULL,NULL),
(8,1,2,'Cần hủy sau khi đặt','Đơn đã hoàn thành','Rejected','2026-01-13 10:00:00','2026-01-13 11:00:00',1),
(9,2,3,'Muốn gộp đơn hàng','Đơn đã xử lý','Rejected','2026-02-09 10:00:00','2026-02-09 11:00:00',1),
(10,3,2,'Đặt sai màu','Đơn đã hoàn thành','Rejected','2026-03-19 10:00:00','2026-03-19 11:00:00',1);

INSERT IGNORE INTO `Review` (`ReviewID`,`ProductID`,`UserID`,`Rating`,`Comment`,`Status`) VALUES
(1,1,2,5,'Áo đẹp, chất vải mát.','active'),(2,1,3,4,'Form hơi rộng nhưng ổn.','active'),
(3,2,3,5,'Quần đúng mô tả.','active'),(4,4,2,4,'Túi da thật cầm chắc tay.','active'),
(5,7,3,5,'Váy giữ nếp tốt.','active'),(6,5,5,4,'Blazer đẹp và rẻ.','active'),
(7,6,6,3,'Giày có vết xước nhẹ.','active'),(8,8,7,5,'Đồng hồ chạy tốt.','active'),
(9,9,8,4,'Máy ảnh đúng như mô tả.','hidden'),(10,10,9,5,'Sách còn mới.','active');

INSERT IGNORE INTO `ProductPriceHistory` (`HistoryID`,`ProductID`,`OldPrice`,`NewPrice`,`ChangedBy`,`ChangedAt`) VALUES
(1,1,250000,150000,1,'2026-01-05 08:00:00'),(2,3,220000,180000,1,'2026-01-06 08:00:00'),
(3,5,300000,222000,1,'2026-01-07 08:00:00'),(4,8,400000,320000,1,'2026-01-08 08:00:00'),
(5,9,650000,585000,1,'2026-01-09 08:00:00'),(6,1,150000,180000,1,'2026-02-01 08:00:00'),
(7,2,350000,330000,1,'2026-02-02 08:00:00'),(8,4,450000,430000,1,'2026-02-03 08:00:00'),
(9,6,280000,260000,1,'2026-02-04 08:00:00'),(10,10,90000,85000,1,'2026-02-05 08:00:00');
