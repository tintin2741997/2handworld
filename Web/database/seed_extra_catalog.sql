USE `2handworld_schema`;

INSERT INTO `Category` (`CategoryID`, `CategoryName`) VALUES
(101, 'Ao thun secondhand'),
(102, 'Ao so mi vintage'),
(103, 'Ao khoac')
ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);

INSERT INTO `Product`
(`ProductID`, `CategoryID`, `ProductName`, `ProductImage`, `Price`, `ImportPrice`, `Description`, `Condition`, `SoldQuantity`, `ProductStatus`, `DiscountPercent`)
VALUES
(101, 101, 'Ao thun basic Uniqlo mau kem', 'https://loremflickr.com/800/800/cream,tshirt/all?lock=2101', 120000, 55000, 'Ao thun cotton mem, form regular, de phoi do hang ngay.', 'Nhu moi', 3, 'active', 0),
(102, 101, 'Ao thun graphic vintage den', 'https://loremflickr.com/800/800/black,graphic,tshirt/all?lock=2102', 150000, 65000, 'Ao thun in graphic phong cach retro, chat vai day vua.', 'Tot', 5, 'active', 10),
(103, 102, 'So mi caro flannel nau do', 'https://loremflickr.com/800/800/plaid,flannel,shirt/all?lock=2103', 210000, 95000, 'So mi flannel day dan, hop mac khoac ngoai hoac layer.', 'Tot', 2, 'active', 0),
(104, 102, 'So mi linen xanh pastel', 'https://loremflickr.com/800/800/blue,linen,shirt/all?lock=2104', 240000, 110000, 'So mi linen thoang mat, mau xanh diu, phu hop di hoc di lam.', 'Nhu moi', 1, 'active', 15),
(105, 103, 'Ao khoac denim xanh washed', 'https://loremflickr.com/800/800/denim,jacket/all?lock=2105', 390000, 210000, 'Ao khoac denim dang rong, mau wash dep, con cung form.', 'Tot', 4, 'active', 0),
(106, 103, 'Blazer oversize mau than', 'https://loremflickr.com/800/800/charcoal,blazer/all?lock=2106', 360000, 170000, 'Blazer oversize toi gian, de phoi voi quan jeans hoac vay.', 'Kha', 1, 'active', 20),
(107, 2, 'Quan jeans ong dung xanh nhat', 'https://loremflickr.com/800/800/light,blue,jeans/all?lock=2107', 320000, 160000, 'Jeans ong dung cap vua, mau xanh nhat, khong loi vai.', 'Tot', 6, 'active', 0),
(108, 2, 'Quan kaki be vintage', 'https://loremflickr.com/800/800/beige,chinos/all?lock=2108', 260000, 120000, 'Quan kaki mau be, form suong, phong cach vintage nhe nhang.', 'Nhu moi', 2, 'active', 12),
(109, 3, 'Dam hoa nhi co vuong', 'https://loremflickr.com/800/800/floral,dress/all?lock=2109', 280000, 130000, 'Dam hoa nhi co vuong, dang xoe nhe, chat vai mem.', 'Nhu moi', 3, 'active', 0),
(110, 3, 'Chan vay midi den xep ly', 'https://loremflickr.com/800/800/black,pleated,skirt/all?lock=2110', 180000, 80000, 'Chan vay midi xep ly mau den, de phoi ao so mi va ao thun.', 'Tot', 4, 'active', 5),
(111, 5, 'Tui tote canvas theu logo', 'https://loremflickr.com/800/800/canvas,tote,bag/all?lock=2111', 140000, 60000, 'Tui tote canvas day, co khoa bam, dung di hoc hoac di cho.', 'Nhu moi', 7, 'active', 0),
(112, 5, 'Tui da deo vai mau nau', 'https://loremflickr.com/800/800/brown,leather,bag/all?lock=2112', 420000, 230000, 'Tui da deo vai mau nau vintage, phu kien kim loai con sang.', 'Kha', 2, 'active', 18),
(113, 4, 'Giay sneaker trang toi gian', 'https://loremflickr.com/800/800/white,sneakers/all?lock=2113', 300000, 150000, 'Sneaker trang da ve sinh, size 38, de con tot.', 'Tot', 3, 'active', 0),
(114, 6, 'That lung da nau co dien', 'https://loremflickr.com/800/800/brown,leather,belt/all?lock=2114', 160000, 70000, 'That lung da nau ban vua, khoa kim loai phong cach co dien.', 'Tot', 5, 'active', 0)
ON DUPLICATE KEY UPDATE
`CategoryID` = VALUES(`CategoryID`),
`ProductName` = VALUES(`ProductName`),
`ProductImage` = VALUES(`ProductImage`),
`Price` = VALUES(`Price`),
`ImportPrice` = VALUES(`ImportPrice`),
`Description` = VALUES(`Description`),
`Condition` = VALUES(`Condition`),
`SoldQuantity` = VALUES(`SoldQuantity`),
`ProductStatus` = VALUES(`ProductStatus`),
`DiscountPercent` = VALUES(`DiscountPercent`);

INSERT INTO `Inventory` (`InventoryID`, `ProductID`, `StockQuantity`, `LowStockThreshold`)
VALUES
(101, 101, 8, 3),
(102, 102, 5, 3),
(103, 103, 4, 2),
(104, 104, 6, 3),
(105, 105, 3, 2),
(106, 106, 2, 2),
(107, 107, 7, 3),
(108, 108, 5, 3),
(109, 109, 4, 2),
(110, 110, 6, 3),
(111, 111, 10, 4),
(112, 112, 2, 2),
(113, 113, 3, 2),
(114, 114, 5, 3)
ON DUPLICATE KEY UPDATE
`StockQuantity` = VALUES(`StockQuantity`),
`LowStockThreshold` = VALUES(`LowStockThreshold`);

INSERT IGNORE INTO `Review` (`ProductID`, `UserID`, `Rating`, `Comment`, `Status`)
VALUES
(101, 2, 5, 'Ao mem, mau ngoai dep hon anh, rat de mac.', 'active'),
(105, 3, 5, 'Ao denim con form tot, phoi do rat on.', 'active'),
(109, 2, 4, 'Dam xinh, dung mo ta, giao hang can than.', 'active'),
(112, 3, 5, 'Tui da dep, hop phong cach vintage.', 'active'),
(113, 2, 4, 'Giay sach, con dung tot so voi gia.', 'active');
