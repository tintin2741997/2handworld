USE `2handworld_schema`;

-- Normalize persisted order/payment statuses to the same English enums used by
-- the frontend and API:
-- Order.Status: pending, confirmed, shipping, completed, cancelled,
--               failed_delivery, returned, rejected
-- Payment.Status: unpaid, paid, failed, refunded

DROP TRIGGER IF EXISTS `trg_BeforeUpdate_Order_StateMachine`;

ALTER TABLE `Payment`
    DROP CONSTRAINT `chk_Payment_DateLogic`;

ALTER TABLE `Payment`
    DROP CONSTRAINT `CONSTRAINT_1`;

ALTER TABLE `Order`
    DROP CONSTRAINT `CONSTRAINT_1`;

UPDATE `Order`
SET `Status` = CASE `Status`
    WHEN 'Chưa xác nhận' THEN 'pending'
    WHEN 'Đã xác nhận' THEN 'confirmed'
    WHEN 'Đang giao' THEN 'shipping'
    WHEN 'Hoàn thành' THEN 'completed'
    WHEN 'Đã hủy' THEN 'cancelled'
    WHEN 'Giao thất bại' THEN 'failed_delivery'
    WHEN 'Đã trả về cửa hàng' THEN 'returned'
    WHEN 'Bị từ chối' THEN 'rejected'
    ELSE `Status`
END;

UPDATE `Payment`
SET `Status` = CASE `Status`
    WHEN 'Chưa thanh toán' THEN 'unpaid'
    WHEN 'Đã thanh toán' THEN 'paid'
    WHEN 'Thanh toán thất bại' THEN 'failed'
    WHEN 'Đã hoàn tiền' THEN 'refunded'
    ELSE `Status`
END;

ALTER TABLE `Order`
    MODIFY `Status` VARCHAR(50) DEFAULT 'pending',
    ADD CONSTRAINT `chk_Order_Status`
        CHECK (`Status` IN (
            'pending',
            'confirmed',
            'shipping',
            'completed',
            'cancelled',
            'failed_delivery',
            'returned',
            'rejected'
        ));

ALTER TABLE `Payment`
    MODIFY `Status` VARCHAR(50) DEFAULT 'unpaid',
    ADD CONSTRAINT `chk_Payment_Status`
        CHECK (`Status` IN ('unpaid', 'paid', 'failed', 'refunded')),
    ADD CONSTRAINT `chk_Payment_DateLogic`
        CHECK (
            (`Status` IN ('paid', 'refunded') AND `PaymentDate` IS NOT NULL)
            OR
            (`Status` IN ('unpaid', 'failed') AND `PaymentDate` IS NULL)
        );

DELIMITER //

CREATE TRIGGER `trg_BeforeUpdate_Order_StateMachine`
BEFORE UPDATE ON `Order`
FOR EACH ROW
BEGIN
    IF OLD.`Status` IN (
        'completed',
        'cancelled',
        'rejected',
        'failed_delivery',
        'returned'
    ) AND NEW.`Status` != OLD.`Status` THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot change a closed order status.';
    END IF;
END //

DELIMITER ;
