USE `2handworld_schema`;

-- Migration bổ sung theo góp ý DBA: map User-Role trong DB,
-- view phân quyền theo đối tượng và view đơn hàng tính tổng từ chi tiết.

CREATE TABLE IF NOT EXISTS `Roles` (
    `RoleID`      INT          AUTO_INCREMENT PRIMARY KEY,
    `RoleCode`    VARCHAR(30)  NOT NULL UNIQUE,
    `RoleName`    VARCHAR(100) NOT NULL,
    `Description` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `UserRoles` (
    `UserID`     INT      NOT NULL,
    `RoleID`     INT      NOT NULL,
    `AssignedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`UserID`, `RoleID`),
    CONSTRAINT `fk_UserRoles_Users` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`),
    CONSTRAINT `fk_UserRoles_Roles` FOREIGN KEY (`RoleID`) REFERENCES `Roles`(`RoleID`)
);

INSERT INTO `Roles` (`RoleCode`, `RoleName`, `Description`) VALUES
('admin', 'Administrator', 'Quản trị hệ thống, xem và thao tác toàn bộ dữ liệu'),
('buyer', 'Buyer', 'Người mua đã đăng nhập, được xem lịch sử mua hàng và tạo đánh giá'),
('guest', 'Guest', 'Khách chưa đăng nhập, chỉ xem dữ liệu công khai và đặt hàng walk-in')
ON DUPLICATE KEY UPDATE
    `RoleName` = VALUES(`RoleName`),
    `Description` = VALUES(`Description`);

INSERT INTO `UserRoles` (`UserID`, `RoleID`)
SELECT u.`UserID`, r.`RoleID`
FROM `Users` u
JOIN `Roles` r ON r.`RoleCode` = u.`Role`
ON DUPLICATE KEY UPDATE `AssignedAt` = `AssignedAt`;

-- Sau migration này, chạy tiếp:
-- 1. routines_views_2handworld.sql để tạo lại các view phân quyền.
-- 2. permissions_2handworld.sql bằng tài khoản DBA/root để cấp quyền MySQL.
