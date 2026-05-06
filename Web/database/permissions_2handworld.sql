USE `2handworld_schema`;

-- ============================================================
-- PHAN QUYEN ROLE / LOGIN / ROUTINE / TRIGGER
-- Chay bang tai khoan DBA/root sau khi tao schema, view, procedure,
-- function va trigger trong DB_2handworld_Update.sql.
-- ============================================================

CREATE ROLE IF NOT EXISTS `role_2handworld_admin`;
CREATE ROLE IF NOT EXISTS `role_2handworld_buyer`;
CREATE ROLE IF NOT EXISTS `role_2handworld_guest`;

CREATE USER IF NOT EXISTS `admin_2handworld`@`localhost` IDENTIFIED BY 'Admin@2handworld2026';
CREATE USER IF NOT EXISTS `buyer_2handworld`@`localhost` IDENTIFIED BY 'Buyer@2handworld2026';
CREATE USER IF NOT EXISTS `guest_2handworld`@`localhost` IDENTIFIED BY 'Guest@2handworld2026';

-- Admin: toan quyen du lieu, duoc thuc thi routine va quan ly trigger.
GRANT SELECT, INSERT, UPDATE, DELETE ON `2handworld_schema`.* TO `role_2handworld_admin`;
GRANT EXECUTE ON FUNCTION `2handworld_schema`.`fn_FinalPrice` TO `role_2handworld_admin`;
GRANT EXECUTE ON PROCEDURE `2handworld_schema`.`sp_UpdateInventory` TO `role_2handworld_admin`;
GRANT EXECUTE ON PROCEDURE `2handworld_schema`.`sp_ProcessCancelRequest` TO `role_2handworld_admin`;
GRANT TRIGGER ON `2handworld_schema`.* TO `role_2handworld_admin`;

-- Buyer: xem san pham/kho/phuong thuc thanh toan, tao don, cap nhat ho so,
-- gio hang, danh gia va yeu cau huy don.
GRANT SELECT ON `2handworld_schema`.`Category` TO `role_2handworld_buyer`;
GRANT SELECT ON `2handworld_schema`.`Product` TO `role_2handworld_buyer`;
GRANT SELECT ON `2handworld_schema`.`Inventory` TO `role_2handworld_buyer`;
GRANT SELECT ON `2handworld_schema`.`PaymentMethod` TO `role_2handworld_buyer`;
GRANT SELECT ON `2handworld_schema`.`vw_ProductInventory` TO `role_2handworld_buyer`;
GRANT SELECT ON `2handworld_schema`.`vw_OrderPaymentSummary` TO `role_2handworld_buyer`;
GRANT SELECT, UPDATE ON `2handworld_schema`.`Users` TO `role_2handworld_buyer`;
GRANT SELECT, INSERT, UPDATE, DELETE ON `2handworld_schema`.`Cart` TO `role_2handworld_buyer`;
GRANT SELECT, INSERT, UPDATE, DELETE ON `2handworld_schema`.`CartItems` TO `role_2handworld_buyer`;
GRANT SELECT, INSERT ON `2handworld_schema`.`Order` TO `role_2handworld_buyer`;
GRANT SELECT, INSERT ON `2handworld_schema`.`OrderDetail` TO `role_2handworld_buyer`;
GRANT SELECT ON `2handworld_schema`.`Payment` TO `role_2handworld_buyer`;
GRANT SELECT, INSERT ON `2handworld_schema`.`CancelRequest` TO `role_2handworld_buyer`;
GRANT SELECT, INSERT, UPDATE, DELETE ON `2handworld_schema`.`Review` TO `role_2handworld_buyer`;
GRANT EXECUTE ON FUNCTION `2handworld_schema`.`fn_FinalPrice` TO `role_2handworld_buyer`;

-- Guest: chi xem du lieu cong khai, dang ky tai khoan va tao don walk-in.
GRANT SELECT ON `2handworld_schema`.`Category` TO `role_2handworld_guest`;
GRANT SELECT ON `2handworld_schema`.`Product` TO `role_2handworld_guest`;
GRANT SELECT ON `2handworld_schema`.`Inventory` TO `role_2handworld_guest`;
GRANT SELECT ON `2handworld_schema`.`Review` TO `role_2handworld_guest`;
GRANT SELECT ON `2handworld_schema`.`PaymentMethod` TO `role_2handworld_guest`;
GRANT SELECT ON `2handworld_schema`.`vw_ProductInventory` TO `role_2handworld_guest`;
GRANT INSERT ON `2handworld_schema`.`Users` TO `role_2handworld_guest`;
GRANT INSERT ON `2handworld_schema`.`Order` TO `role_2handworld_guest`;
GRANT INSERT ON `2handworld_schema`.`OrderDetail` TO `role_2handworld_guest`;
GRANT SELECT, INSERT, UPDATE, DELETE ON `2handworld_schema`.`Cart` TO `role_2handworld_guest`;
GRANT SELECT, INSERT, UPDATE, DELETE ON `2handworld_schema`.`CartItems` TO `role_2handworld_guest`;
GRANT EXECUTE ON FUNCTION `2handworld_schema`.`fn_FinalPrice` TO `role_2handworld_guest`;

GRANT `role_2handworld_admin` TO `admin_2handworld`@`localhost`;
GRANT `role_2handworld_buyer` TO `buyer_2handworld`@`localhost`;
GRANT `role_2handworld_guest` TO `guest_2handworld`@`localhost`;

SET DEFAULT ROLE `role_2handworld_admin` FOR `admin_2handworld`@`localhost`;
SET DEFAULT ROLE `role_2handworld_buyer` FOR `buyer_2handworld`@`localhost`;
SET DEFAULT ROLE `role_2handworld_guest` FOR `guest_2handworld`@`localhost`;

FLUSH PRIVILEGES;
