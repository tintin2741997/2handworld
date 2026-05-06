USE `2handworld_schema`;

-- Du lieu mau bo sung cho cac bang phu. Tat ca deu dung INSERT IGNORE
-- de neu trung khoa chinh/unique thi bo qua, khong ghi de du lieu hien co.

INSERT IGNORE INTO `InventoryLog`
(`LogID`, `ProductID`, `OrderID`, `ChangeQuantity`, `Reason`, `LogDate`)
VALUES
(1, 1, 1, -1, 'Xuáº¥t bÃ¡n', '2026-01-12 09:15:00'),
(2, 2, 2, -1, 'Xuáº¥t bÃ¡n', '2026-02-08 14:20:00'),
(3, 3, 2, -1, 'Xuáº¥t bÃ¡n', '2026-02-08 14:20:00'),
(4, 4, 3, -1, 'Xuáº¥t bÃ¡n', '2026-03-18 10:05:00'),
(5, 7, 4, -2, 'Xuáº¥t bÃ¡n', '2026-04-20 08:40:00');

INSERT IGNORE INTO `CancelRequest`
(`RequestID`, `OrderID`, `UserID`, `ReasonBuyer`, `ReasonAdmin`, `Status`, `CreatedAt`, `ResolvedAt`, `ResolvedBy`)
VALUES
(1, 4, 3, 'Muon doi sang san pham khac', NULL, 'Pending', '2026-04-20 09:10:00', NULL, NULL),
(2, 3, 2, 'Dat nham dia chi giao hang', 'Don da hoan thanh nen khong the huy', 'Rejected', '2026-03-18 11:00:00', '2026-03-18 11:30:00', 1);

INSERT IGNORE INTO `ProductPriceHistory`
(`HistoryID`, `ProductID`, `OldPrice`, `NewPrice`, `ChangedBy`, `ChangedAt`)
VALUES
(1, 1, 300000, 250000, 1, '2026-01-01 08:00:00'),
(2, 3, 250000, 220000, 1, '2026-01-05 08:00:00'),
(3, 5, 360000, 300000, 1, '2026-01-10 08:00:00'),
(4, 8, 450000, 400000, 1, '2026-01-15 08:00:00');

INSERT IGNORE INTO `Cart` (`CartID`, `UserID`, `SessionID`)
VALUES
(1, 2, NULL),
(2, 3, NULL),
(3, NULL, 'guest-session-demo-001');

INSERT IGNORE INTO `CartItems` (`CartItemsID`, `CartID`, `ProductID`, `Quantity`)
VALUES
(1, 1, 6, 1),
(2, 2, 8, 1),
(3, 3, 5, 1);
