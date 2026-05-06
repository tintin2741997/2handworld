USE `2handworld_schema`;
SET NAMES utf8mb4;

-- Sua cac dong moi duoc bo sung tu seed_user_insert_ignore_sample.sql
-- neu PowerShell pipe lam hong dau tieng Viet khi chay mysql.

UPDATE `Category`
SET `CategoryName` = CASE `CategoryID`
    WHEN 7 THEN 'Sách'
    WHEN 8 THEN 'Đồ điện tử'
    WHEN 9 THEN 'Đồ gia dụng'
    WHEN 10 THEN 'Đồ decor'
END
WHERE `CategoryID` IN (7, 8, 9, 10);

UPDATE `Product`
SET
    `ProductName` = 'Máy Ảnh Film Mini Đã Qua Sử Dụng',
    `Description` = 'Máy ảnh film mini đã test.',
    `Condition` = 'Khá'
WHERE `ProductID` = 9;

UPDATE `Product`
SET
    `ProductName` = 'Sách Thiết Kế UI UX Căn Bản',
    `Description` = 'Sách còn mới, đầy đủ trang.',
    `Condition` = 'Tot'
WHERE `ProductID` = 10;
