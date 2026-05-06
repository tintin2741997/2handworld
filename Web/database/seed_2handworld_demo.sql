USE `2handworld_schema`;

INSERT IGNORE INTO `PaymentMethod` (`MethodName`) VALUES
('COD'),
('Bank'),
('Trực tiếp tại cửa hàng');

INSERT IGNORE INTO `Users`
(`UserID`, `Username`, `Email`, `PhoneNumber`, `Password`, `Address`, `Status`, `Role`)
VALUES
(1, 'Admin', 'admin@2hand.vn', '0999999999', '$2y$10$gkGFJH/ZS45sC/SrnKQ9SO.s.06sIwXhfkaI7Vr9VAfMF16r5aFly', '2HANDWORLD Office', NULL, 'admin'),
(2, 'Nguyen Van A', 'nguyenvana@gmail.com', '0901112222', '$2y$10$5S4gaFEj4JIlM5tdSmXuS.pkDY0RTyKU/R43luq/0u9FX3NVRs76a', '123 Le Loi, Q.1, TP.HCM', 'Normal', 'buyer'),
(3, 'Tran Thi B', 'tranthib@gmail.com', '0903334444', '$2y$10$5S4gaFEj4JIlM5tdSmXuS.pkDY0RTyKU/R43luq/0u9FX3NVRs76a', '456 Nguyen Hue, Q.1, TP.HCM', 'VIP', 'buyer'),
(4, 'Le Hoang C', 'lehoangc@gmail.com', '0905556666', '$2y$10$5S4gaFEj4JIlM5tdSmXuS.pkDY0RTyKU/R43luq/0u9FX3NVRs76a', '12 CMT8, TP.HCM', 'Blacklist', 'buyer');

INSERT IGNORE INTO `Blacklist` (`UserID`, `PhoneNumber`, `Reason`)
VALUES (4, '0905556666', 'Bom hang 3 lan lien tiep');

INSERT IGNORE INTO `Category` (`CategoryID`, `CategoryName`) VALUES
(1, 'Ao'),
(2, 'Quan'),
(3, 'Vay/Dam'),
(4, 'Giay dep'),
(5, 'Tui xach'),
(6, 'Phu kien');

INSERT IGNORE INTO `Product`
(`ProductID`, `CategoryID`, `ProductName`, `ProductImage`, `Price`, `ImportPrice`, `Description`, `Condition`, `SoldQuantity`, `ProductStatus`, `DiscountPercent`)
VALUES
(1, 1, 'Ao So Mi Linen Trang Vintage', 'https://loremflickr.com/800/800/white,linen,shirt/all?lock=2001', 250000, 90000, 'Ao so mi linen chat lieu thoang mat, phong cach vintage thanh lich.', 'Nhu moi', 0, 'active', 40),
(2, 2, 'Quan Jeans Levis 501 Xanh Dam', 'https://loremflickr.com/800/800/blue,jeans/all?lock=2002', 350000, 180000, 'Quan jeans Levis chinh hang, do moi khoang 90%, form dung.', 'Tot', 0, 'active', 0),
(3, 3, 'Dam Hoa Nhi Dang Dai Mua Thu', 'https://loremflickr.com/800/800/floral,dress/all?lock=2003', 220000, 100000, 'Dam hoa nhi phong cach Han Quoc, chat voan lua mem mai.', 'Nhu moi', 0, 'active', 18),
(4, 5, 'Tui Xach Da That Deo Cheo Retro', 'https://loremflickr.com/800/800/brown,leather,bag/all?lock=2004', 450000, 240000, 'Tui xach da that mau nau bo vintage, phu kien dong thau.', 'Kha', 0, 'active', 0),
(5, 1, 'Ao Khoac Blazer Ke Caro Oversize', 'https://loremflickr.com/800/800/plaid,blazer/all?lock=2005', 300000, 140000, 'Blazer form rong phong cach menswear, hoa tiet ke caro.', 'Tot', 0, 'active', 26),
(6, 4, 'Giay Oxford Da Nu Co Dien', 'https://loremflickr.com/800/800/oxford,shoes/all?lock=2006', 280000, 120000, 'Giay oxford da mau nau dam, size 37, da ve sinh va danh xi.', 'Trung binh', 0, 'active', 0),
(7, 3, 'Chan Vay Midi Xep Ly Mau Be', 'https://loremflickr.com/800/800/pleated,skirt/all?lock=2007', 120000, 50000, 'Chan vay xep ly dang dai qua goi, cap chun co gian thoai mai.', 'Nhu moi', 0, 'active', 0),
(8, 6, 'Dong Ho Day Da Mat Vuong Vintage', 'https://loremflickr.com/800/800/square,wristwatch/all?lock=2008', 400000, 210000, 'Dong ho nu mat vuong, may quartz chay chuan gio.', 'Tot', 0, 'active', 20);

INSERT IGNORE INTO `Inventory` (`InventoryID`, `ProductID`, `StockQuantity`, `LowStockThreshold`)
VALUES
(1, 1, 2, 3),
(2, 2, 1, 3),
(3, 3, 3, 3),
(4, 4, 1, 3),
(5, 5, 1, 3),
(6, 6, 1, 3),
(7, 7, 4, 3),
(8, 8, 1, 3);

INSERT IGNORE INTO `Review` (`ReviewID`, `ProductID`, `UserID`, `Rating`, `Comment`, `Status`)
VALUES
(1, 1, 2, 5, 'Ao dep, chat vai mat, dong goi can than.', 'active'),
(2, 1, 3, 4, 'Form hoi rong nhung mac oversize van on.', 'active'),
(3, 2, 3, 5, 'Quan dung mo ta, mau xanh rat de phoi do.', 'active'),
(4, 4, 2, 4, 'Tui da that cam chac tay, vintage dep.', 'active'),
(5, 7, 3, 5, 'Vay giu nep tot, mau be de mac.', 'active');

INSERT IGNORE INTO `Order`
(`OrderID`, `UserID`, `OrderDate`, `TotalAmount`, `Status`, `PhoneNumber`, `Address`, `CreatedAt`, `UpdatedAt`)
VALUES
(1, 2, '2026-01-12 09:15:00', 180000, 'Hoàn thành', '0901112222', '123 Le Loi, Q.1, TP.HCM', '2026-01-12 09:15:00', '2026-01-14 16:30:00'),
(2, 3, '2026-02-08 14:20:00', 530000, 'Hoàn thành', '0903334444', '456 Nguyen Hue, Q.1, TP.HCM', '2026-02-08 14:20:00', '2026-02-10 11:00:00'),
(3, 2, '2026-03-18 10:05:00', 480000, 'Hoàn thành', '0901112222', '123 Le Loi, Q.1, TP.HCM', '2026-03-18 10:05:00', '2026-03-20 15:45:00'),
(4, 3, '2026-04-20 08:40:00', 270000, 'Chưa xác nhận', '0903334444', '456 Nguyen Hue, Q.1, TP.HCM', '2026-04-20 08:40:00', '2026-04-20 08:40:00');

INSERT IGNORE INTO `OrderDetail` (`OrderID`, `ProductID`, `Quantity`, `Price`)
VALUES
(1, 1, 1, 150000),
(2, 2, 1, 350000),
(2, 3, 1, 180000),
(3, 4, 1, 450000),
(4, 7, 2, 120000);

INSERT IGNORE INTO `Payment` (`PaymentID`, `OrderID`, `MethodID`, `Status`, `PaymentDate`)
VALUES
(1, 1, 1, 'Đã thanh toán', '2026-01-14 16:30:00'),
(2, 2, 2, 'Đã thanh toán', '2026-02-08 14:30:00'),
(3, 3, 1, 'Đã thanh toán', '2026-03-20 15:45:00'),
(4, 4, 1, 'Chưa thanh toán', NULL);
