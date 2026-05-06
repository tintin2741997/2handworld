SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `CartItems`;
TRUNCATE TABLE `Cart`;
TRUNCATE TABLE `CancelRequest`;
TRUNCATE TABLE `Review`;
TRUNCATE TABLE `Payment`;
TRUNCATE TABLE `OrderDetail`;
TRUNCATE TABLE `Order`;
TRUNCATE TABLE `InventoryLog`;
TRUNCATE TABLE `Inventory`;
TRUNCATE TABLE `ProductPriceHistory`;
TRUNCATE TABLE `Product`;
TRUNCATE TABLE `Category`;
TRUNCATE TABLE `Blacklist`;
TRUNCATE TABLE `PaymentMethod`;
TRUNCATE TABLE `Users`;

ALTER TABLE `PaymentMethod` MODIFY `MethodName` VARCHAR(50) NOT NULL;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS (11 rows)
INSERT INTO `Users` (`UserID`, `Username`, `Email`, `PhoneNumber`, `Password`, `Address`, `Status`, `Role`) VALUES
(1, 'Admin 2Hand', 'admin@2hand.vn', '0909999999', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', 'Trụ sở 2HandWorld', NULL, 'admin'),
(2, 'Nguyễn Văn An', 'nguyenvan.an@gmail.com', '0901112222', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '123 Lê Lợi, Q.1, TP.HCM', 'Normal', 'buyer'),
(3, 'Trần Thị Bình', 'binhtran.99@gmail.com', '0903334444', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '456 Nguyễn Huệ, Q.1, TP.HCM', 'VIP', 'buyer'),
(4, 'Lê Hoàng Cường', 'cuongle.dev@gmail.com', '0905556666', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '789 Trần Hưng Đạo, Q.1, TP.HCM', 'Normal', 'buyer'),
(5, 'Phạm Thu Dung', 'thudung.pham@yahoo.com', '0981112233', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '12 Hai Bà Trưng, Hoàn Kiếm, HN', 'Normal', 'buyer'),
(6, 'Hoàng Trọng Ân', 'tronganh@gmail.com', '0972223344', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '34 Nguyễn Văn Cừ, Long Biên, HN', 'Blacklist', 'buyer'),
(7, 'Đặng Minh Khôi', 'khoi.dang@outlook.com', '0913334455', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '56 Tôn Đức Thắng, Q.Đống Đa, HN', 'Normal', 'buyer'),
(8, 'Vũ Ngọc Hân', 'ngochan.vu@gmail.com', '0934445566', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '78 CMT8, Q.3, TP.HCM', 'VIP', 'buyer'),
(9, 'Bùi Tấn Phát', 'tanphat.bui@gmail.com', '0945556677', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '90 Phan Đăng Lưu, Phú Nhuận, TP.HCM', 'Normal', 'buyer'),
(10, 'Đỗ Lan Hương', 'lanhuong.do@gmail.com', '0966667788', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '112 Nguyễn Thị Minh Khai, Q.3, TP.HCM', 'Normal', 'buyer'),
(11, 'Ngô Đức Thắng', 'thang.ngo@gmail.com', '0927778899', '$2y$10$wT5gWJ/8e.R1I9Z7qK./K.qQ109tUfA.2xGZ5988V4k97bL0d6ZlC', '33 Hoàng Diệu, Hải Châu, Đà Nẵng', 'Normal', 'buyer');

-- 2. CATEGORY (10 rows)
INSERT INTO `Category` (`CategoryID`, `CategoryName`) VALUES
(1, 'Áo Khoác & Blazer'),
(2, 'Áo Thun & Sơ Mi'),
(3, 'Quần Jeans & Kaki'),
(4, 'Váy & Đầm Vintage'),
(5, 'Giày Dép 2Hand'),
(6, 'Túi Xách & Phụ Kiện'),
(7, 'Đồng Hồ Cũ'),
(8, 'Mắt Kính'),
(9, 'Đồ Công Nghệ Cũ'),
(10, 'Đồ Gia Dụng');

-- 3. PRODUCT (12 rows)
INSERT INTO `Product` (`ProductID`, `CategoryID`, `ProductName`, `ProductImage`, `Price`, `ImportPrice`, `Description`, `Condition`, `SoldQuantity`, `ProductStatus`, `DiscountPercent`) VALUES
(1, 2, 'Áo Sơ Mi Linen Trắng Minimal', 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=600&q=80', 150000, 80000, 'Áo sơ mi linen trắng hàng tuyển 2hand', 'Như mới', 1, 'active', 0),
(2, 3, 'Quần Jeans Levi''s 501 Xanh Đậm', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80', 350000, 150000, 'Jeans Levis chính hãng hàng si tuyển', 'Tốt', 2, 'active', 10),
(3, 4, 'Đầm Hoa Nhí Dáng Dài Mùa Thu', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', 180000, 90000, 'Đầm vintage họa tiết hoa nhí', 'Khá', 1, 'active', 0),
(4, 6, 'Túi Xách Da Thật Đeo Chéo Retro', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80', 450000, 200000, 'Túi xách da thật secondhand', 'Tốt', 1, 'active', 15),
(5, 1, 'Áo Khoác Blazer Kẻ Caro Oversize', 'https://images.unsplash.com/photo-1591369822096-fb14ce694e38?auto=format&fit=crop&w=600&q=80', 250000, 100000, 'Blazer kẻ caro phối màu nâu nhạt', 'Như mới', 1, 'active', 0),
(6, 2, 'Áo Thun Graphic Band Tee Rock', 'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?auto=format&fit=crop&w=600&q=80', 120000, 50000, 'Áo thun ban nhạc rock in hình sắc nét', 'Trung bình', 0, 'active', 0),
(7, 4, 'Chân Váy Midi Xếp Ly Màu Be', 'https://images.unsplash.com/photo-1583496661160-c588c443c982?auto=format&fit=crop&w=600&q=80', 140000, 60000, 'Chân váy xếp ly cạp chun thoải mái', 'Tốt', 2, 'active', 5),
(8, 1, 'Áo Khoác Denim Jacket Levi''s Type III', 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0efa?auto=format&fit=crop&w=600&q=80', 650000, 300000, 'Denim jacket kinh điển', 'Khá', 0, 'active', 0),
(9, 5, 'Giày Oxford Da Nâu Nam Tính', 'https://images.unsplash.com/photo-1614252209825-980bf1b34b16?auto=format&fit=crop&w=600&q=80', 550000, 250000, 'Giày tây Oxford da bò thật 2hand', 'Tốt', 0, 'active', 0),
(10, 6, 'Kính Râm Mắt Mèo Gọng Đồi Mồi', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80', 180000, 70000, 'Phụ kiện kính râm form mắt mèo', 'Như mới', 0, 'active', 20),
(11, 2, 'Áo Len Cardigan Dệt Kim Họa Tiết', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80', 220000, 90000, 'Cardigan len dày, họa tiết thổ cẩm vintage', 'Như mới', 0, 'active', 0),
(12, 3, 'Quần Kaki Ống Rộng Túi Hộp', 'https://images.unsplash.com/photo-1624378439575-d10c6d420dc1?auto=format&fit=crop&w=600&q=80', 190000, 80000, 'Kaki túi hộp dáng rộng', 'Tốt', 0, 'active', 0);

-- 4. INVENTORY (12 rows)
INSERT INTO `Inventory` (`InventoryID`, `ProductID`, `StockQuantity`, `LowStockThreshold`) VALUES
(1, 1, 3, 2),
(2, 2, 2, 1),
(3, 3, 5, 2),
(4, 4, 1, 1),
(5, 5, 4, 2),
(6, 6, 2, 2),
(7, 7, 6, 3),
(8, 8, 1, 1),
(9, 9, 2, 1),
(10, 10, 5, 2),
(11, 11, 3, 1),
(12, 12, 4, 2);

-- 5. PAYMENT METHOD (10 rows)
INSERT IGNORE INTO `PaymentMethod` (`MethodID`, `MethodName`) VALUES
(1, 'COD'),
(2, 'Bank'),
(3, 'Trực tiếp tại cửa hàng'),
(4, 'Momo'),
(5, 'ZaloPay'),
(6, 'VNPay'),
(7, 'ViettelPay'),
(8, 'ShopeePay'),
(9, 'Apple Pay'),
(10, 'PayPal');

-- 6. ORDER (10 rows)
INSERT INTO `Order` (`OrderID`, `UserID`, `OrderDate`, `TotalAmount`, `Status`, `PhoneNumber`, `Address`) VALUES
(1, 2, '2026-04-10 09:15:00', 180000, 'Hoàn thành', '0901112222', '123 Lê Lợi, Q.1, TP.HCM'),
(2, 3, '2026-04-15 14:20:00', 345000, 'Hoàn thành', '0903334444', '456 Nguyễn Huệ, Q.1, TP.HCM'),
(3, 8, '2026-04-20 10:05:00', 412500, 'Hoàn thành', '0934445566', '78 CMT8, Q.3, TP.HCM'),
(4, 5, '2026-05-01 08:40:00', 180000, 'Đã xác nhận', '0981112233', '12 Hai Bà Trưng, Hoàn Kiếm, HN'),
(5, 7, '2026-05-02 11:20:00', 250000, 'Đang giao', '0913334455', '56 Tôn Đức Thắng, Q.Đống Đa, HN'),
(6, 10, '2026-05-03 14:10:00', 133000, 'Đã xác nhận', '0966667788', '112 Nguyễn Thị Minh Khai, Q.3, TP.HCM'),
(7, 4, '2026-05-04 09:00:00', 190000, 'Chưa xác nhận', '0905556666', '789 Trần Hưng Đạo, Q.1, TP.HCM'),
(8, 9, '2026-05-04 16:30:00', 315000, 'Đã hủy', '0945556677', '90 Phan Đăng Lưu, Phú Nhuận, TP.HCM'),
(9, 11, '2026-05-05 08:15:00', 220000, 'Chưa xác nhận', '0927778899', '33 Hoàng Diệu, Hải Châu, Đà Nẵng'),
(10, NULL, '2026-05-05 10:00:00', 150000, 'Chưa xác nhận', '0991112222', 'Khách Vãng Lai, Q.10, TP.HCM');

-- 7. ORDER DETAIL (10 rows)
INSERT INTO `OrderDetail` (`OrderID`, `ProductID`, `Quantity`, `Price`) VALUES
(1, 1, 1, 150000), 
(2, 2, 1, 315000), 
(3, 4, 1, 382500), 
(4, 3, 1, 180000), 
(5, 5, 1, 250000), 
(6, 7, 1, 133000), 
(7, 12, 1, 190000), 
(8, 2, 1, 315000), 
(9, 11, 1, 220000), 
(10, 1, 1, 150000); 

-- 8. PAYMENT (10 rows)
INSERT INTO `Payment` (`PaymentID`, `OrderID`, `MethodID`, `Status`, `PaymentDate`) VALUES
(1, 1, 1, 'Đã thanh toán', '2026-04-12 16:30:00'),
(2, 2, 2, 'Đã thanh toán', '2026-04-15 14:30:00'),
(3, 3, 2, 'Đã thanh toán', '2026-04-20 10:10:00'),
(4, 4, 1, 'Chưa thanh toán', NULL),
(5, 5, 1, 'Chưa thanh toán', NULL),
(6, 6, 2, 'Đã thanh toán', '2026-05-03 14:15:00'),
(7, 7, 1, 'Chưa thanh toán', NULL),
(8, 8, 1, 'Chưa thanh toán', NULL),
(9, 9, 1, 'Chưa thanh toán', NULL),
(10, 10, 1, 'Chưa thanh toán', NULL);

-- 9. REVIEW (10 rows)
INSERT INTO `Review` (`ReviewID`, `ProductID`, `UserID`, `Rating`, `Comment`, `Status`, `CreatedAt`) VALUES
(1, 1, 2, 5, 'Áo đẹp, chất vải lanh rất mát', 'active', '2026-03-01 10:00:00'),
(2, 1, 3, 4, 'Áo hơi nhăn một xíu', 'active', '2026-03-05 14:30:00'),
(3, 2, 8, 5, 'Levis chuẩn xịn', 'active', '2026-03-10 09:15:00'),
(4, 3, 5, 5, 'Đầm thơm, mới tinh', 'active', '2026-03-12 16:45:00'),
(5, 4, 2, 4, 'Da thật cầm rất chắc tay', 'active', '2026-03-15 11:20:00'),
(6, 5, 7, 5, 'Blazer xịn', 'active', '2026-03-20 08:00:00'),
(7, 7, 10, 5, 'Váy xinh xỉu', 'active', '2026-03-22 13:10:00'),
(8, 7, 3, 4, 'Váy dài qua gối', 'active', '2026-03-25 19:30:00'),
(9, 2, 9, 3, 'Quần đẹp nhưng form hơi kích', 'active', '2026-03-28 15:00:00'),
(10, 12, 4, 5, 'Quần túi hộp xịn', 'active', '2026-04-05 10:20:00');

-- 10. BLACKLIST (10 rows)
INSERT INTO `Blacklist` (`BlacklistID`, `UserID`, `PhoneNumber`, `Reason`, `CreatedAt`) VALUES
(1, 6, '0972223344', 'Bom hàng 3 lần', '2026-04-25 10:00:00'),
(2, NULL, '0912223333', 'Gọi chửi bới nhân viên', '2026-04-26 10:00:00'),
(3, NULL, '0913334444', 'Từ chối nhận hàng không lý do', '2026-04-27 10:00:00'),
(4, NULL, '0914445555', 'Đặt ảo', '2026-04-28 10:00:00'),
(5, NULL, '0915556666', 'Lừa đảo', '2026-04-29 10:00:00'),
(6, NULL, '0916667777', 'Yêu cầu hủy liên tục', '2026-04-30 10:00:00'),
(7, NULL, '0917778888', 'Cố tình đánh giá 1 sao', '2026-05-01 10:00:00'),
(8, NULL, '0918889999', 'Sử dụng thẻ giả', '2026-05-02 10:00:00'),
(9, NULL, '0919990000', 'Không nghe máy khi shipper giao', '2026-05-03 10:00:00'),
(10, NULL, '0920001111', 'Tạo tài khoản ảo', '2026-05-04 10:00:00');

-- 11. INVENTORY LOG (10 rows)
INSERT INTO `InventoryLog` (`LogID`, `ProductID`, `OrderID`, `ChangeQuantity`, `Reason`, `LogDate`) VALUES
(1, 1, 1, -1, 'Xuất bán', '2026-04-10 09:15:00'),
(2, 2, 2, -1, 'Xuất bán', '2026-04-15 14:20:00'),
(3, 4, 3, -1, 'Xuất bán', '2026-04-20 10:05:00'),
(4, 3, 4, -1, 'Xuất bán', '2026-05-01 08:40:00'),
(5, 5, 5, -1, 'Xuất bán', '2026-05-02 11:20:00'),
(6, 7, 6, -1, 'Xuất bán', '2026-05-03 14:10:00'),
(7, 12, 7, -1, 'Xuất bán', '2026-05-04 09:00:00'),
(8, 2, 8, -1, 'Xuất bán', '2026-05-04 16:30:00'),
(9, 2, 8, 1, 'Hoàn hàng', '2026-05-04 17:00:00'),
(10, 11, 9, -1, 'Xuất bán', '2026-05-05 08:15:00');

-- 12. CANCEL REQUEST (10 rows)
-- Status: Pending, Approved, Rejected
INSERT INTO `CancelRequest` (`RequestID`, `OrderID`, `UserID`, `ReasonBuyer`, `ReasonAdmin`, `Status`, `CreatedAt`, `ResolvedAt`, `ResolvedBy`) VALUES
(1, 8, 9, 'Đổi ý không muốn mua nữa', 'Đồng ý hủy', 'Approved', '2026-05-04 16:45:00', '2026-05-04 17:00:00', 1),
(2, 9, 11, 'Tìm thấy chỗ khác rẻ hơn', NULL, 'Pending', '2026-05-05 09:00:00', NULL, NULL),
(3, 7, 4, 'Bấm nhầm đặt hàng', 'Đồng ý hủy', 'Approved', '2026-05-04 09:10:00', '2026-05-04 09:15:00', 1),
(4, 4, 5, 'Muốn đổi địa chỉ', 'Không thể đổi, đã gửi hàng', 'Rejected', '2026-05-01 10:00:00', '2026-05-01 10:30:00', 1),
(5, 5, 7, 'Giao quá lâu', NULL, 'Pending', '2026-05-03 09:00:00', NULL, NULL),
(6, 6, 10, 'Không cần nữa', 'Đồng ý', 'Approved', '2026-05-03 15:00:00', '2026-05-03 15:30:00', 1),
(7, 2, 3, 'Test hệ thống', 'Phát hiện test', 'Rejected', '2026-04-15 15:00:00', '2026-04-15 15:10:00', 1),
(8, 3, 8, 'Hết tiền', 'Đồng ý', 'Approved', '2026-04-20 11:00:00', '2026-04-20 11:30:00', 1),
(9, 1, 2, 'Sai thông tin', 'Đã sửa', 'Rejected', '2026-04-10 10:00:00', '2026-04-10 10:30:00', 1),
(10, 10, 4, 'Đổi món', NULL, 'Pending', '2026-05-05 10:10:00', NULL, NULL);

-- 13. PRODUCT PRICE HISTORY (10 rows)
INSERT INTO `ProductPriceHistory` (`HistoryID`, `ProductID`, `OldPrice`, `NewPrice`, `ChangedBy`, `ChangedAt`) VALUES
(1, 1, 160000, 150000, 1, '2026-03-01 10:00:00'),
(2, 2, 400000, 350000, 1, '2026-03-02 10:00:00'),
(3, 3, 200000, 180000, 1, '2026-03-03 10:00:00'),
(4, 4, 500000, 450000, 1, '2026-03-04 10:00:00'),
(5, 5, 300000, 250000, 1, '2026-03-05 10:00:00'),
(6, 6, 150000, 120000, 1, '2026-03-06 10:00:00'),
(7, 7, 180000, 140000, 1, '2026-03-07 10:00:00'),
(8, 8, 700000, 650000, 1, '2026-03-08 10:00:00'),
(9, 9, 600000, 550000, 1, '2026-03-09 10:00:00'),
(10, 10, 220000, 180000, 1, '2026-03-10 10:00:00');

-- 14. CART (10 rows)
INSERT INTO `Cart` (`CartID`, `UserID`, `SessionID`) VALUES
(1, 2, NULL),
(2, 3, NULL),
(3, 4, NULL),
(4, 5, NULL),
(5, 7, NULL),
(6, 8, NULL),
(7, 9, NULL),
(8, 10, NULL),
(9, 11, NULL),
(10, NULL, 'session_guest_001');

-- 15. CART ITEMS (10 rows)
INSERT INTO `CartItems` (`CartItemsID`, `CartID`, `ProductID`, `Quantity`) VALUES
(1, 1, 1, 1),
(2, 2, 2, 1),
(3, 3, 3, 1),
(4, 4, 4, 1),
(5, 5, 5, 1),
(6, 6, 6, 1),
(7, 7, 7, 1),
(8, 8, 8, 1),
(9, 9, 9, 1),
(10, 10, 10, 1);
