USE `2handworld_schema`;

DROP VIEW IF EXISTS `vw_OrderPaymentSummary`;
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
    IN p_Reason VARCHAR(50)
)
BEGIN
    UPDATE `Inventory`
    SET `StockQuantity` = `StockQuantity` + p_QuantityDelta
    WHERE `ProductID` = p_ProductID;

    INSERT INTO `InventoryLog` (`ProductID`, `ChangeQuantity`, `Reason`)
    VALUES (p_ProductID, p_QuantityDelta, p_Reason);
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
    p.`ProductName`,
    c.`CategoryName`,
    p.`Price`,
    p.`ImportPrice`,
    p.`DiscountPercent`,
    fn_FinalPrice(p.`Price`, p.`DiscountPercent`) AS `FinalPrice`,
    i.`StockQuantity`,
    i.`LowStockThreshold`,
    p.`ProductStatus`
FROM `Product` p
JOIN `Category` c ON c.`CategoryID` = p.`CategoryID`
LEFT JOIN `Inventory` i ON i.`ProductID` = p.`ProductID`;

CREATE OR REPLACE VIEW `vw_OrderPaymentSummary` AS
SELECT
    o.`OrderID`,
    o.`UserID`,
    u.`Username`,
    o.`TotalAmount`,
    o.`Status` AS `OrderStatus`,
    pm.`MethodName`,
    pay.`Status` AS `PaymentStatus`,
    pay.`PaymentDate`,
    o.`OrderDate`
FROM `Order` o
LEFT JOIN `Users` u ON u.`UserID` = o.`UserID`
LEFT JOIN `Payment` pay ON pay.`OrderID` = o.`OrderID`
LEFT JOIN `PaymentMethod` pm ON pm.`MethodID` = pay.`MethodID`;
