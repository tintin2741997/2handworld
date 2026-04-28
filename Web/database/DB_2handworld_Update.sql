-- ============================================================
-- DATABASE: 2handworld_schema
-- Phiên bản: v2
-- Thay đổi so với v1:
--   1. Users.Status CHECK: 'thường' → 'Normal', 'blacklist' → 'Blacklist'
--   2. Order.Status CHECK: 'Giao không thành công' → 'Giao thất bại'
--   3. Trigger 3: đồng bộ tên trạng thái đóng với CHECK Order
--   4. Inventory: thêm cột LowStockThreshold (BR-INV-03)
--   5. Black list: Thêm CHECK (UserID IS NOT NULL OR PhoneNumber IS NOT NULL)
--   6. Trigger 1: Thêm IF v_stock IS NULL OR v_stock < NEW.Quantity
-- ============================================================

CREATE DATABASE IF NOT EXISTS `2handworld_schema`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `2handworld_schema`;

-- ============================================================
-- 1. Bảng Users
-- Role: 'admin' | 'buyer'
-- Status chỉ áp dụng cho buyer: 'Normal' | 'VIP' | 'Blacklist'
-- Admin: Status = NULL
-- ============================================================
CREATE TABLE `Users` (
    `UserID`      INT          AUTO_INCREMENT PRIMARY KEY,
    `Username`    VARCHAR(150) NOT NULL,
    `Email`       VARCHAR(150) NOT NULL UNIQUE,
    `PhoneNumber` VARCHAR(15)  NOT NULL UNIQUE,
    `Password`    VARCHAR(255) NOT NULL,
    `Address`     VARCHAR(255),
    `Status`      VARCHAR(20)  DEFAULT 'Normal',
    `Role`        VARCHAR(20)  NOT NULL DEFAULT 'buyer',
    `CreatedAt`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (
        (`Role` = 'buyer' AND `Status` IN ('Normal', 'VIP', 'Blacklist'))
        OR
        (`Role` = 'admin' AND `Status` IS NULL)
    )
);

-- ============================================================
-- 2. Bảng Category
-- ============================================================
CREATE TABLE `Category` (
    `CategoryID`   INT          AUTO_INCREMENT PRIMARY KEY,
    `CategoryName` VARCHAR(100) NOT NULL
);

-- ============================================================
-- 3. Bảng Product
-- ProductStatus: 'active' | 'hidden' | 'sold-out'
-- Trigger 2 tự động đồng bộ ProductStatus với Inventory
-- ============================================================
CREATE TABLE `Product` (
    `ProductID`       INT          AUTO_INCREMENT PRIMARY KEY,
    `CategoryID`      INT          NOT NULL,
    `ProductName`     VARCHAR(150) NOT NULL,
    `ProductImage`    VARCHAR(255),
    `Price`           INT          NOT NULL,
    `ImportPrice`     INT          NOT NULL,
    `Description`     VARCHAR(255),
    `Condition`       VARCHAR(40),
    `SoldQuantity`    INT          DEFAULT 0,
    `ProductStatus`   VARCHAR(15)  DEFAULT 'active',
    `DiscountPercent` INT          DEFAULT 0,
    `CreatedAt`       DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt`       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`Price` > 0 AND `ImportPrice` > 0),
    CHECK (`ProductStatus` IN ('active', 'hidden', 'sold-out')),
    CHECK (`DiscountPercent` BETWEEN 0 AND 100)
);

-- ============================================================
-- 4. Bảng Inventory
-- LowStockThreshold: ngưỡng cảnh báo sắp hết hàng (BR-INV-03)
-- Trigger 2 AFTER UPDATE tự động cập nhật ProductStatus
-- ============================================================
CREATE TABLE `Inventory` (
    `InventoryID`       INT      AUTO_INCREMENT PRIMARY KEY,
    `ProductID`         INT,
    `StockQuantity`     INT      NOT NULL DEFAULT 0,
    `LowStockThreshold` INT      NOT NULL DEFAULT 5,
    `DateUpdate`        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`StockQuantity` >= 0),
    CHECK (`LowStockThreshold` >= 0)
);

-- ============================================================
-- 5. Bảng InventoryLog
-- Reason ENUM đồng bộ với đồ án Ch.3 & Ch.5
-- ============================================================
CREATE TABLE `InventoryLog` (
    `LogID`           INT  AUTO_INCREMENT PRIMARY KEY,
    `ProductID`       INT,
    `OrderID`         INT  NULL,
    `ChangeQuantity`  INT  NOT NULL,
    `Reason`          ENUM('Nhập hàng', 'Xuất bán', 'Hoàn hàng', 'Thay đổi số lượng', 'Tổn thất') NOT NULL,
    `LogDate`         DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. Bảng Blacklist
-- UserID hoặc PhoneNumber (ít nhất 1 phải có giá trị)
-- ============================================================
CREATE TABLE `Blacklist` (
    `BlacklistID` INT          AUTO_INCREMENT PRIMARY KEY,
    `UserID`      INT          NULL,
    `PhoneNumber` VARCHAR(15)  NULL,
    `Reason`      VARCHAR(255) NOT NULL,
    `CreatedAt`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    CHECK (CHAR_LENGTH(`Reason`) > 0),
    CHECK (`UserID` IS NOT NULL OR `PhoneNumber` IS NOT NULL)
);

-- ============================================================
-- 7. Bảng Order
-- Status ENUM đồng bộ với BR-ORD-01 và Trigger 3
-- Trạng thái đóng: Hoàn thành, Đã hủy, Bị từ chối, Giao thất bại, Đã trả về cửa hàng
-- ============================================================
CREATE TABLE `Order` (
    `OrderID`     INT          AUTO_INCREMENT PRIMARY KEY,
    `UserID`      INT,
    `OrderDate`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `TotalAmount` INT          NOT NULL,
    `Status`      VARCHAR(50)  DEFAULT 'Chưa xác nhận',
    `PhoneNumber` VARCHAR(15),
    `Address`     VARCHAR(255),
    `CreatedAt`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`Status` IN (
        'Chưa xác nhận',
        'Đã xác nhận',
        'Đang giao',
        'Hoàn thành',
        'Đã hủy',
        'Giao thất bại',
        'Đã trả về cửa hàng',
        'Bị từ chối'
    ))
);

-- ============================================================
-- 8. Bảng OrderDetail
-- Trigger 1: BEFORE INSERT kiểm tra tồn kho
-- Trigger 4: BEFORE UPDATE chặn sửa giá trị lịch sử
-- ============================================================
CREATE TABLE `OrderDetail` (
    `OrderID`   INT NOT NULL,
    `ProductID` INT NOT NULL,
    `Quantity`  INT NOT NULL,
    `Price`     INT NOT NULL,
    PRIMARY KEY (`OrderID`, `ProductID`),
    CHECK (`Quantity` > 0),
    CHECK (`Price`    > 0)
);

-- ============================================================
-- 9. Bảng PaymentMethod
-- ============================================================
CREATE TABLE `PaymentMethod` (
    `MethodID`   INT  AUTO_INCREMENT PRIMARY KEY,
    `MethodName` ENUM('COD', 'Bank', 'Trực tiếp tại cửa hàng') NOT NULL
);

-- ============================================================
-- 10. Bảng Payment
-- Status và PaymentDate phải nhất quán (BR-PAY)
-- ============================================================
CREATE TABLE `Payment` (
    `PaymentID`   INT         AUTO_INCREMENT PRIMARY KEY,
    `OrderID`     INT         NOT NULL,
    `MethodID`    INT         NOT NULL,
    `Status`      VARCHAR(50) DEFAULT 'Chưa thanh toán',
    `PaymentDate` DATETIME    DEFAULT NULL,
    CHECK (`Status` IN ('Chưa thanh toán', 'Đã thanh toán', 'Thanh toán thất bại', 'Đã hoàn tiền'))
);

-- ============================================================
-- 11. Bảng Review
-- ============================================================
CREATE TABLE `Review` (
    `ReviewID`  INT          AUTO_INCREMENT PRIMARY KEY,
    `ProductID` INT          NOT NULL,
    `UserID`    INT          NOT NULL,
    `Rating`    INT          NOT NULL,
    `Comment`   VARCHAR(255),
    `Status`    VARCHAR(50)  DEFAULT 'active',
    `CreatedAt` DATETIME     DEFAULT CURRENT_TIMESTAMP,
    CHECK (`Rating` BETWEEN 1 AND 5)
);

-- ============================================================
-- 12. Bảng CancelRequest
-- Accountability: khi Pending → ResolvedAt/ResolvedBy phải NULL
-- ============================================================
CREATE TABLE `CancelRequest` (
    `RequestID`   INT          AUTO_INCREMENT PRIMARY KEY,
    `OrderID`     INT          NOT NULL,
    `UserID`      INT          NOT NULL,
    `ReasonBuyer` VARCHAR(255),
    `ReasonAdmin` VARCHAR(255),
    `Status`      VARCHAR(50)  DEFAULT 'Pending',
    `CreatedAt`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `ResolvedAt`  DATETIME     DEFAULT NULL,
    `ResolvedBy`  INT          DEFAULT NULL
);

-- ============================================================
-- 13. Bảng ProductPriceHistory
-- ============================================================
CREATE TABLE `ProductPriceHistory` (
    `HistoryID`  INT      AUTO_INCREMENT PRIMARY KEY,
    `ProductID`  INT      NOT NULL,
    `OldPrice`   INT      NOT NULL,
    `NewPrice`   INT      NOT NULL,
    `ChangedBy`  INT,
    `ChangedAt`  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 14. Bảng Cart
-- UserID = NULL cho buyer walk-in (dùng SessionID)
-- ============================================================
CREATE TABLE `Cart` (
    `CartID`    INT          AUTO_INCREMENT PRIMARY KEY,
    `UserID`    INT          DEFAULT NULL,
    `SessionID` VARCHAR(100) DEFAULT NULL
);

-- ============================================================
-- 15. Bảng CartItems
-- ============================================================
CREATE TABLE `CartItems` (
    `CartItemsID` INT AUTO_INCREMENT PRIMARY KEY,
    `CartID`      INT NOT NULL,
    `ProductID`   INT NOT NULL,
    `Quantity`    INT NOT NULL,
    CHECK (`Quantity` > 0)
);


-- ============================================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================================

-- Product → Category
ALTER TABLE `Product`
    ADD CONSTRAINT `fk_Product_Category`
        FOREIGN KEY (`CategoryID`) REFERENCES `Category`(`CategoryID`);

-- Blacklist → Users
ALTER TABLE `Blacklist`
    ADD CONSTRAINT `fk_Blacklist_Users`
        FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`);

-- Order → Users (UserID nullable: walk-in có UserID = NULL)
ALTER TABLE `Order`
    ADD CONSTRAINT `fk_Order_Users`
        FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`);

-- OrderDetail → Order, Product
ALTER TABLE `OrderDetail`
    ADD CONSTRAINT `fk_OrderDetail_Order`   FOREIGN KEY (`OrderID`)   REFERENCES `Order`(`OrderID`),
    ADD CONSTRAINT `fk_OrderDetail_Product` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`);

-- Payment → Order, PaymentMethod
ALTER TABLE `Payment`
    ADD CONSTRAINT `fk_Payment_Order`  FOREIGN KEY (`OrderID`)  REFERENCES `Order`(`OrderID`),
    ADD CONSTRAINT `fk_Payment_Method` FOREIGN KEY (`MethodID`) REFERENCES `PaymentMethod`(`MethodID`);

-- Review → Product, Users
ALTER TABLE `Review`
    ADD CONSTRAINT `fk_Review_Product` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`),
    ADD CONSTRAINT `fk_Review_Users`   FOREIGN KEY (`UserID`)    REFERENCES `Users`(`UserID`);

-- CancelRequest → Order, Users (requester), Users (resolver = admin)
ALTER TABLE `CancelRequest`
    ADD CONSTRAINT `fk_Cancel_Order` FOREIGN KEY (`OrderID`)    REFERENCES `Order`(`OrderID`),
    ADD CONSTRAINT `fk_Cancel_User`  FOREIGN KEY (`UserID`)     REFERENCES `Users`(`UserID`),
    ADD CONSTRAINT `fk_Cancel_Admin` FOREIGN KEY (`ResolvedBy`) REFERENCES `Users`(`UserID`);

-- Inventory → Product
ALTER TABLE `Inventory`
    ADD CONSTRAINT `fk_Inventory_Product`
        FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`);

-- InventoryLog → Product, Order
ALTER TABLE `InventoryLog`
    ADD CONSTRAINT `fk_InvLog_Product` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`),
    ADD CONSTRAINT `fk_InvLog_Order`   FOREIGN KEY (`OrderID`)   REFERENCES `Order`(`OrderID`);

-- ProductPriceHistory → Product, Users (admin)
ALTER TABLE `ProductPriceHistory`
    ADD CONSTRAINT `fk_PriceHistory_Product` FOREIGN KEY (`ProductID`)  REFERENCES `Product`(`ProductID`),
    ADD CONSTRAINT `fk_PriceHistory_Admin`   FOREIGN KEY (`ChangedBy`)  REFERENCES `Users`(`UserID`);

-- Cart → Users
ALTER TABLE `Cart`
    ADD CONSTRAINT `fk_Cart_Users`
        FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`);

-- CartItems → Cart, Product
ALTER TABLE `CartItems`
    ADD CONSTRAINT `fk_CartItems_Cart`    FOREIGN KEY (`CartID`)    REFERENCES `Cart`(`CartID`),
    ADD CONSTRAINT `fk_CartItems_Product` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`);


-- ============================================================
-- BUSINESS RULE CHECK CONSTRAINTS
-- ============================================================

-- CancelRequest: ResolvedAt không thể trước CreatedAt
-- Khi Pending: ResolvedAt và ResolvedBy phải NULL
-- Khi không phải Pending: cả hai phải có giá trị
ALTER TABLE `CancelRequest`
    ADD CONSTRAINT `chk_Cancel_TimeLogic`
        CHECK (`ResolvedAt` IS NULL OR `ResolvedAt` >= `CreatedAt`),
    ADD CONSTRAINT `chk_Cancel_Accountability`
        CHECK (
            (`Status` = 'Pending'  AND `ResolvedAt` IS NULL     AND `ResolvedBy` IS NULL)
            OR
            (`Status` != 'Pending' AND `ResolvedAt` IS NOT NULL AND `ResolvedBy` IS NOT NULL)
        );

-- Payment: PaymentDate bắt buộc khi đã thanh toán/hoàn tiền; phải NULL khi chưa/thất bại
ALTER TABLE `Payment`
    ADD CONSTRAINT `chk_Payment_DateLogic`
        CHECK (
            (`Status` IN ('Đã thanh toán', 'Đã hoàn tiền')          AND `PaymentDate` IS NOT NULL)
            OR
            (`Status` IN ('Chưa thanh toán', 'Thanh toán thất bại') AND `PaymentDate` IS NULL)
        );

-- ProductPriceHistory: giá hợp lệ và phải thay đổi
ALTER TABLE `ProductPriceHistory`
    ADD CONSTRAINT `chk_PriceHistory_Valid`
        CHECK (`OldPrice` > 0 AND `NewPrice` > 0 AND `OldPrice` <> `NewPrice`);


-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER //

-- Trigger 1: Chặn mua lố tồn kho (BR-CART-03, BR-CART-04)
-- BEFORE INSERT trên OrderDetail
-- Điều kiện: số lượng đặt mua > StockQuantity hiện tại
CREATE TRIGGER `trg_BeforeInsert_OrderDetail_StockCheck`
BEFORE INSERT ON `OrderDetail`
FOR EACH ROW
BEGIN
    DECLARE v_stock INT;
    SELECT `StockQuantity` INTO v_stock
    FROM   `Inventory`
    WHERE  `ProductID` = NEW.`ProductID`;

    IF v_stock IS NULL OR v_stock < NEW.`Quantity` THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lỗi: Số lượng đặt mua vượt quá tồn kho hiện tại.';
    END IF;
END //

-- Trigger 2: Đồng bộ ProductStatus khi tồn kho thay đổi
-- AFTER UPDATE trên Inventory
-- Tồn kho = 0  → ProductStatus = 'sold-out'
-- Tồn kho > 0 (từ 0) → ProductStatus = 'active'
CREATE TRIGGER `trg_AfterUpdate_Inventory_SyncStatus`
AFTER UPDATE ON `Inventory`
FOR EACH ROW
BEGIN
    IF NEW.`StockQuantity` = 0 AND OLD.`StockQuantity` > 0 THEN
        UPDATE `Product`
        SET    `ProductStatus` = 'sold-out'
        WHERE  `ProductID` = NEW.`ProductID`;

    ELSEIF NEW.`StockQuantity` > 0 AND OLD.`StockQuantity` = 0 THEN
        UPDATE `Product`
        SET    `ProductStatus` = 'active'
        WHERE  `ProductID` = NEW.`ProductID`;
    END IF;
END //

-- Trigger 3: Bảo vệ chu trình đơn hàng — chặn thay đổi trạng thái đã ĐÓNG
-- BEFORE UPDATE trên Order
-- Trạng thái đóng đồng bộ với CHECK constraint của bảng Order
CREATE TRIGGER `trg_BeforeUpdate_Order_StateMachine`
BEFORE UPDATE ON `Order`
FOR EACH ROW
BEGIN
    IF OLD.`Status` IN (
        'Hoàn thành',
        'Đã hủy',
        'Bị từ chối',
        'Giao thất bại',
        'Đã trả về cửa hàng'
    ) AND NEW.`Status` != OLD.`Status` THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lỗi: Không thể thay đổi trạng thái của đơn hàng đã đóng.';
    END IF;
END //

-- Trigger 4: Đóng băng giá trị giao dịch — chặn UPDATE trên OrderDetail
-- BEFORE UPDATE trên OrderDetail
-- Chi tiết đơn hàng là dữ liệu lịch sử, không được sửa
CREATE TRIGGER `trg_BeforeUpdate_OrderDetail_Immutable`
BEFORE UPDATE ON `OrderDetail`
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lỗi: Chi tiết đơn hàng là dữ liệu lịch sử, không được phép sửa đổi.';
END //

-- Trigger 5: Chống xóa cứng đơn hàng — bảo vệ audit trail
-- BEFORE DELETE trên Order
CREATE TRIGGER `trg_BeforeDelete_Order_AntiHardDelete`
BEFORE DELETE ON `Order`
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lỗi kiểm toán: Không được phép xóa đơn hàng khỏi hệ thống.';
END //