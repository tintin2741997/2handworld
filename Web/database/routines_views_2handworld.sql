USE `2handworld_schema`;

DROP VIEW IF EXISTS `vw_GuestOrderLookup`;
DROP VIEW IF EXISTS `vw_BuyerOrderHistory`;
DROP VIEW IF EXISTS `vw_OrderPaymentSummary`;
DROP VIEW IF EXISTS `vw_AdminProductCatalog`;
DROP VIEW IF EXISTS `vw_BuyerProductCatalog`;
DROP VIEW IF EXISTS `vw_GuestProductCatalog`;
DROP VIEW IF EXISTS `vw_ProductInventory`;
DROP PROCEDURE IF EXISTS `sp_ProcessCancelRequest`;
DROP PROCEDURE IF EXISTS `sp_UpdateInventory`;
DROP FUNCTION IF EXISTS `fn_FinalPrice`;

DELIMITER //

CREATE FUNCTION `fn_FinalPrice`(p_price INT, p_discount INT)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN ROUND(p_price * (100 - IFNULL(p_discount, 0)) / 100);
END //

CREATE PROCEDURE `sp_UpdateInventory`(
    IN p_ProductID INT,
    IN p_QuantityDelta INT,
    IN p_Reason VARCHAR(50),
    IN p_OrderID INT
)
BEGIN
    UPDATE `Inventory`
    SET `StockQuantity` = `StockQuantity` + p_QuantityDelta
    WHERE `ProductID` = p_ProductID;

    INSERT INTO `InventoryLog` (`ProductID`, `OrderID`, `ChangeQuantity`, `Reason`)
    VALUES (p_ProductID, p_OrderID, p_QuantityDelta, p_Reason);
END //

CREATE PROCEDURE `sp_ProcessCancelRequest`(
    IN p_RequestID INT,
    IN p_AdminID INT,
    IN p_Status VARCHAR(20),
    IN p_AdminReason VARCHAR(255)
)
BEGIN
    UPDATE `CancelRequest`
    SET `Status` = p_Status,
        `ReasonAdmin` = p_AdminReason,
        `ResolvedAt` = NOW(),
        `ResolvedBy` = p_AdminID
    WHERE `RequestID` = p_RequestID;
END //

DELIMITER ;

CREATE OR REPLACE VIEW `vw_ProductInventory` AS
SELECT
    p.`ProductID`,
    p.`CategoryID`,
    p.`ProductName`,
    p.`ProductImage`,
    c.`CategoryName`,
    p.`Price`,
    p.`ImportPrice`,
    p.`Description`,
    p.`Condition`,
    p.`SoldQuantity`,
    p.`DiscountPercent`,
    fn_FinalPrice(p.`Price`, p.`DiscountPercent`) AS `FinalPrice`,
    COALESCE(i.`StockQuantity`, 0) AS `StockQuantity`,
    COALESCE(i.`LowStockThreshold`, 5) AS `LowStockThreshold`,
    i.`DateUpdate`,
    p.`ProductStatus`,
    p.`CreatedAt`,
    p.`UpdatedAt`
FROM `Product` p
JOIN `Category` c ON c.`CategoryID` = p.`CategoryID`
LEFT JOIN `Inventory` i ON i.`ProductID` = p.`ProductID`;

CREATE OR REPLACE VIEW `vw_GuestProductCatalog` AS
SELECT
    `ProductID`,
    `CategoryID`,
    `ProductName`,
    `ProductImage`,
    `CategoryName`,
    `FinalPrice`,
    `Condition`,
    `StockQuantity`,
    `ProductStatus`
FROM `vw_ProductInventory`
WHERE `ProductStatus` = 'active';

CREATE OR REPLACE VIEW `vw_BuyerProductCatalog` AS
SELECT
    `ProductID`,
    `CategoryID`,
    `ProductName`,
    `ProductImage`,
    `CategoryName`,
    `Price`,
    `DiscountPercent`,
    `FinalPrice`,
    `Description`,
    `Condition`,
    `SoldQuantity`,
    `StockQuantity`,
    `ProductStatus`,
    `CreatedAt`
FROM `vw_ProductInventory`
WHERE `ProductStatus` != 'hidden';

CREATE OR REPLACE VIEW `vw_AdminProductCatalog` AS
SELECT *
FROM `vw_ProductInventory`;

CREATE OR REPLACE VIEW `vw_OrderPaymentSummary` AS
SELECT
    o.`OrderID`,
    o.`UserID`,
    u.`Username`,
    u.`Email`,
    o.`PhoneNumber`,
    o.`Address`,
    COALESCE(SUM(od.`Price` * od.`Quantity`), o.`TotalAmount`, 0) AS `TotalAmount`,
    COALESCE(SUM(od.`Price` * od.`Quantity`), 0) AS `CalculatedTotalAmount`,
    o.`Status`,
    o.`Status` AS `OrderStatus`,
    pm.`MethodName`,
    pay.`Status` AS `PaymentStatus`,
    pay.`PaymentDate`,
    o.`OrderDate`,
    o.`CreatedAt`,
    o.`UpdatedAt`
FROM `Order` o
LEFT JOIN `Users` u ON u.`UserID` = o.`UserID`
LEFT JOIN `OrderDetail` od ON od.`OrderID` = o.`OrderID`
LEFT JOIN `Payment` pay ON pay.`OrderID` = o.`OrderID`
LEFT JOIN `PaymentMethod` pm ON pm.`MethodID` = pay.`MethodID`
GROUP BY
    o.`OrderID`,
    o.`UserID`,
    u.`Username`,
    u.`Email`,
    o.`PhoneNumber`,
    o.`Address`,
    o.`TotalAmount`,
    o.`Status`,
    pm.`MethodName`,
    pay.`Status`,
    pay.`PaymentDate`,
    o.`OrderDate`,
    o.`CreatedAt`,
    o.`UpdatedAt`;

CREATE OR REPLACE VIEW `vw_BuyerOrderHistory` AS
SELECT
    `OrderID`,
    `UserID`,
    `Username`,
    `PhoneNumber`,
    `Address`,
    `TotalAmount`,
    `CalculatedTotalAmount`,
    `Status`,
    `OrderStatus`,
    `MethodName`,
    `PaymentStatus`,
    `PaymentDate`,
    `OrderDate`,
    `CreatedAt`,
    `UpdatedAt`
FROM `vw_OrderPaymentSummary`
WHERE `UserID` IS NOT NULL;

CREATE OR REPLACE VIEW `vw_GuestOrderLookup` AS
SELECT
    `OrderID`,
    `UserID`,
    `Username`,
    `Email`,
    `PhoneNumber`,
    `Address`,
    `TotalAmount`,
    `CalculatedTotalAmount`,
    `Status`,
    `OrderStatus`,
    `MethodName`,
    `PaymentStatus`,
    `OrderDate`,
    `CreatedAt`,
    `UpdatedAt`
FROM `vw_OrderPaymentSummary`
WHERE `UserID` IS NULL;
