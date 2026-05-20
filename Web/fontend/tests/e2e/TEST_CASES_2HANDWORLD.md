# 2HANDWORLD E2E Test Cases

Nguon tham chieu: `19052026_DA_QLTT.docx`, cac muc doi tuong su dung, business rules va dac ta use case chuong 2.

| ID | Luong chinh | Actor | Muc tieu kiem thu | Ky vong | Playwright coverage |
| --- | --- | --- | --- | --- | --- |
| TC-BW-01 | Trang public va tim kiem san pham | Buyer walk-in | Mo trang chu, san pham, cua hang, tin tuc; tim kiem san pham | Route public load duoc, main content hien thi, ket qua tim kiem dung | `[ID:BW01]`, `[ID:BW02-FILTER-EDGE-01]` |
| TC-BW-02 | Xem chi tiet san pham | Buyer walk-in | Mo chi tiet san pham, xem thong tin, review, bien dong gia | Ten san pham, gia, review/tab lien quan hien dung | `[ID:BW05-DETAIL-EDGE-01]` |
| TC-BW-03 | Gio hang va checkout guest | Buyer walk-in | Them san pham vao gio, tang so luong, checkout khong can login | Tao don thanh cong, guest khong vao duoc "Don hang cua toi" | `[ID:BW07-BW10]`, `[ID:BW-WALKIN-01]` |
| TC-BW-04 | Validate checkout va ton kho | Buyer walk-in / Buyer account | Thieu thong tin bat buoc va dat qua ton kho | Form/API chan tao don va bao loi phu hop | `[ID:BW-CHECKOUT-NEG-01]` |
| TC-BA-01 | Dang ky tai khoan | Buyer account | Validate form dang ky, trung email, tao buyer moi | Loi validate hien dung; tai khoan moi dang nhap duoc | `[ID:BA01-REGISTER-NEG-POS-01]` |
| TC-BA-02 | Dang nhap/dang xuat | Buyer account | Login sai va login dung | Login sai hien loi; login dung vao he thong; logout quay lai dang nhap | `[ID:BA02]` |
| TC-BA-03 | Ho so va don hang cua toi | Buyer account | Cap nhat ho so, xem danh sach don cua minh | Thong tin ho so luu; don hang chi cua user hien tai | `[ID:BA18]`, `[ID:BA-ORDER-SECURITY-01]` |
| TC-BA-04 | Gui yeu cau huy don | Buyer account | Buyer gui ly do huy don hop le | Cancel request duoc tao va luu ly do buyer | `[ID:AD09-CANCEL-REQ-01]` |
| TC-AD-01 | Truy cap module admin | Admin | Mo dashboard, san pham, danh muc, don hang, nguoi dung, ton kho, review, bao cao | Moi module admin load duoc va hien dung noi dung chinh | `[ID:AD-MODULES-01]` |
| TC-AD-02 | Quan ly san pham/danh muc | Admin | Tao, tim, sua, an san pham; tao/sua/xoa danh muc | Bang du lieu cap nhat dung va khong lo san pham hidden ra buyer | `[ID:AD-PRODUCT-CRUD-01]`, `[ID:AD-CATEGORY-CRUD-NEG-01]` |
| TC-AD-03 | Quan ly don hang va thanh toan | Admin | Cap nhat order status, payment status | Status don va payment state duoc luu tach biet | `[ID:AD10-PAYMENT-FAILED-01]`, `[ID:DP-ORDER-USER-01]` |
| TC-AD-04 | Xu ly yeu cau huy don | Admin | Duyet/tu choi cancel request co ly do | Request doi trang thai dung; don hang dong bo neu duyet | `[ID:AD09-CANCEL-REQ-01]` |
| TC-AD-05 | Risk control: VIP/Blacklist | Admin | Gan VIP, blacklist account, blacklist so dien thoai; canh bao tren don | Badge/canh bao hien dung, ly do blacklist duoc luu | `[ID:AD-USER-RISK-01]`, `[ID:AD-RISK-01]`, `[ID:AD-RISK-STATUS-01]` |
| TC-AD-06 | Quan ly ton kho | Admin | Loc/tim san pham ton kho, cap nhat stock | So luong ton kho moi hien dung va dong bo voi san pham | `[ID:AD-INVENTORY-01]`, `[ID:DP-PRODUCT-01]` |
| TC-AD-07 | Review va bao cao | Buyer / Admin | Buyer tao review; admin an review; dashboard bao cao doanh thu/loi nhuan | Review dong bo buyer-admin; bao cao co so lieu DB | `[ID:DP-REVIEW-01]`, `[ID:AD-REPORT-01]` |

Ghi chu chat luong expected result:

- Cac test public/admin khong chi kiem tra mo duoc route, ma kiem tra heading/noi dung chinh dung voi tung man hinh.
- Cac test co thao tac nghiep vu phai kiem tra ket qua luu/doi trang thai qua UI hoac API lien quan.
- Cac man hinh public/admin duoc kiem tra them dieu kien khong co dau hieu loi encoding tieng Viet nhu `Ã`, `Ä`, `áº`, `Æ` trong text dang hien thi.
