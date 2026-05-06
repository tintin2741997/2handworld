import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const API_BASE = 'http://127.0.0.1/2handworld/Web/backend/api';
const buyer = { email: 'nguyenvana@gmail.com', password: '123456' };
const admin = { email: 'admin@2hand.vn', password: 'admin123' };
const tempBuyerPassword = '123456';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryName?: string;
  condition?: string;
  store?: string;
  stock: number;
  status?: string;
  isSale?: boolean;
  rating?: number;
  createdAt?: string;
  images: string[];
};

type Order = {
  id: string;
  orderNumber: string;
  userId?: string | null;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  orderStatus: string;
  paymentStatus: string;
  shippingInfo: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    note: string;
  };
};

type BuyerCred = {
  email: string;
  password: string;
};

async function apiData<T>(request: APIRequestContext, path: string): Promise<T> {
  const response = await request.get(`${API_BASE}${path}`);
  expect(response.ok(), `${path} should return 2xx`).toBeTruthy();
  const payload = await response.json();
  expect(payload.success, `${path} should return success=true`).toBeTruthy();
  return payload.data as T;
}

async function apiPost<T>(request: APIRequestContext, path: string, data: unknown): Promise<T> {
  const response = await request.post(`${API_BASE}${path}`, { data });
  expect(response.ok(), `${path} should return 2xx`).toBeTruthy();
  const payload = await response.json();
  expect(payload.success, `${path} should return success=true`).toBeTruthy();
  return payload.data as T;
}

async function apiPatch<T>(request: APIRequestContext, path: string, data: unknown): Promise<T> {
  const response = await request.patch(`${API_BASE}${path}`, { data });
  expect(response.ok(), `${path} should return 2xx`).toBeTruthy();
  const payload = await response.json();
  expect(payload.success, `${path} should return success=true`).toBeTruthy();
  return payload.data as T;
}

async function apiExpectFailure(
  request: APIRequestContext,
  method: 'get' | 'post' | 'patch' | 'put' | 'delete',
  path: string,
  data?: unknown
) {
  const url = `${API_BASE}${path}`;
  const options = data === undefined ? undefined : { data };
  const response =
    method === 'get'
      ? await request.get(url, options)
      : method === 'post'
        ? await request.post(url, options)
        : method === 'patch'
          ? await request.patch(url, options)
          : method === 'put'
            ? await request.put(url, options)
            : await request.delete(url, options);
  expect(response.ok(), `${method.toUpperCase()} ${path} should fail`).toBeFalsy();
  const payload = await response.json().catch(() => ({}));
  expect(payload.success, `${method.toUpperCase()} ${path} should not return success=true`).not.toBeTruthy();
  return { status: response.status(), payload };
}

async function apiLogin(request: APIRequestContext, email: string, password: string) {
  await apiPost(request, '/auth/login', { email, password });
}

async function apiLogout(request: APIRequestContext) {
  const response = await request.post(`${API_BASE}/auth/logout`);
  expect(response.ok(), '/auth/logout should return 2xx').toBeTruthy();
}

async function createTempBuyer(request: APIRequestContext): Promise<BuyerCred> {
  const unique = Date.now();
  const creds = {
    email: `pw-e2e-${unique}@example.com`,
    password: tempBuyerPassword
  };

  await apiPost(request, '/auth/register', {
    name: `PW Buyer ${unique}`,
    email: creds.email,
    phone: `09188${String(unique).slice(-5)}`,
    password: creds.password,
    address: `Address ${unique}`
  });
  await apiLogout(request);
  return creds;
}

async function createBuyerOrderViaApi(request: APIRequestContext): Promise<{ order: Order; buyer: BuyerCred }> {
  const products = await apiData<Product[]>(request, '/products?admin=1');
  const product = products.find(
    (item) => item.stock > 1 && (item.status || 'active') === 'active' && !item.name.includes('kiá»ƒm thá»­ Playwright')
  );
  expect(product, 'demo data should include an active product with stock').toBeTruthy();

  const tempBuyer = await createTempBuyer(request);
  await apiLogin(request, tempBuyer.email, tempBuyer.password);
  const unique = Date.now();
  const createdOrder = await apiPost<Order>(request, '/orders', {
    items: [{ productId: product!.id, quantity: 1 }],
    shippingInfo: {
      fullName: `Buyer E2E ${unique}`,
      phone: `09077${String(unique).slice(-5)}`,
      email: 'buyer-e2e@example.com',
      address: `123 E2E Street ${unique}`,
      city: 'hcm',
      district: 'q1',
      ward: 'p1',
      note: `Playwright flow ${unique}`
    },
    paymentMethod: 'cod',
    shippingFee: 30000
  });
  await apiLogout(request);
  return { order: createdOrder, buyer: tempBuyer };
}

async function createProductViaApi(request: APIRequestContext): Promise<Product> {
  const categories = await apiData<Array<{ id: string }>>(request, '/categories');
  expect(categories.length, 'categories should exist').toBeGreaterThan(0);

  await apiLogin(request, admin.email, admin.password);
  const unique = Date.now();
  const product = await apiPost<Product>(request, '/products', {
    name: `Propagation Product ${unique}`,
    categoryId: categories[0].id,
    price: 189000,
    importPrice: 99000,
    condition: 'Tot',
    stock: 7,
    lowStockThreshold: 3,
    discountPercent: 0,
    image: 'https://picsum.photos/seed/propagation/600/600',
    description: `Propagation test ${unique}`,
    status: 'active'
  });
  await apiLogout(request);
  return product;
}

async function login(page: Page, email: string, password: string) {
  await page.goto('/dang-nhap');
  const authForm = page.locator('main form').first();
  await authForm.locator('input[type="email"]').fill(email);
  await authForm.locator('input[type="password"]').fill(password);
  await authForm.locator('button[type="submit"]').click();
  await expect(page).not.toHaveURL(/\/dang-nhap$/);
}

async function clearCart(page: Page) {
  await page.goto('/gio-hang');
  const deleteButtons = page.locator('main button').filter({ hasText: /Xóa|Xoá/ });
  while (await deleteButtons.count()) {
    await deleteButtons.first().click();
    await page.waitForTimeout(250);
  }
}

async function addProductToCart(page: Page, product: Product) {
  await page.goto(`/san-pham/${product.id}`);
  await expect(page.locator('h1')).toContainText(product.name);
  await page.locator('main').locator('button').filter({ hasText: /Thêm|Them|giỏ|gio/i }).first().click();
  await page.goto('/gio-hang');
  await expect(page.locator('main')).toContainText(product.name);
}

async function getActiveProductWithStock(
  request: APIRequestContext,
  minStock = 1
): Promise<Product> {
  const products = await apiData<Product[]>(request, '/products?admin=1');
  const product = products.find(
    (item) =>
      item.stock >= minStock &&
      (item.status || 'active') === 'active' &&
      !item.name.includes('Playwright')
  );
  expect(product, `demo data should include an active product with stock >= ${minStock}`).toBeTruthy();
  return product!;
}

test.describe('2HAND WORLD buyer website', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('[ID:BW01][EXPECT:Trang public va ket qua tim kiem hien thi dung route va co main] opens public pages and searches products', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toContainText('2HAND WORLD');
    await expect(page.locator('main')).toBeVisible();

    for (const path of ['/san-pham', '/cua-hang', '/tin-tuc', '/gioi-thieu', '/chinh-sach', '/lien-he', '/sitemap']) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/')));
    }

    await page.goto('/');
    await page.locator('header form input[type="text"]').first().fill('test');
    await page.locator('header form button[type="submit"]').first().click();
    await expect(page).toHaveURL(/\/san-pham\?q=test/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('[ID:BA02][EXPECT:Login sai hien loi, login dung vao he thong, logout quay lai trang dang nhap] validates login errors and logs buyer in/out', async ({ page }) => {
    await page.goto('/dang-nhap');
    const authForm = page.locator('main form').first();
    await authForm.locator('button[type="submit"]').click();
    await expect(authForm.locator('..')).toContainText(/email/i);

    await authForm.locator('input[type="email"]').fill('wrong@example.com');
    await authForm.locator('input[type="password"]').fill('wrong');
    await authForm.locator('button[type="submit"]').click();
    await expect(page.locator('main')).toContainText(/th|fail|invalid|kh/i);

    await login(page, buyer.email, buyer.password);
    await expect(page.locator('header')).toContainText(/Nguy|V/);
    await page.locator('header button').filter({ hasText: /Nguy|V/ }).first().click();
    await page.locator('button').filter({ hasText: /xu|out/i }).last().click();
    await expect(page.locator('header a[href="/dang-nhap"]')).toBeVisible();
  });

  test('[ID:BW07-BW10][EXPECT:Them gio, tang so luong, checkout thanh cong va hien thong bao dat hang] adds cart item, updates quantity, and completes checkout', async ({ page, request }) => {
    const products = await apiData<Product[]>(request, '/products?admin=1');
    const tempBuyer = await createTempBuyer(request);
    const purchasableProduct = products.find(
      (product) =>
        product.stock > 2 &&
        (product.status || 'active') === 'active' &&
        !product.name.includes('kiểm thử Playwright')
    );
    expect(purchasableProduct, 'demo data should include an active product with stock').toBeTruthy();

    await login(page, tempBuyer.email, tempBuyer.password);
    await clearCart(page);
    await addProductToCart(page, purchasableProduct!);

    const cartItem = page.locator('main .divide-y > div').first();
    await cartItem.locator('button').filter({ visible: true }).nth(2).click();
    await expect(cartItem).toContainText('2');

    await page.locator('a[href="/thanh-toan"]').click();
    await page.locator('input[name="fullName"]').fill('Nguyen Van Automation');
    await page.locator('input[name="phone"]').fill('0901234567');
    await page.locator('input[name="email"]').fill('automation@example.com');
    await page.locator('input[name="address"]').fill('123 Test Street');
    await page.locator('select[name="city"]').selectOption('hcm');
    await page.locator('select[name="district"]').selectOption('q1');
    await page.locator('select[name="ward"]').selectOption('p1');
    await page.locator('textarea[name="note"]').fill('Playwright e2e order');
    await page.locator('main form').first().locator('button[type="submit"]').click();
    await page.locator('input[value="bank_transfer"]').check();
    await page.locator('main form').first().locator('button[type="submit"]').click();
    await page.locator('main').locator('button').last().click();
    await expect(page.locator('main')).toContainText(/th.nh c.ng|success/i);
  });

  test('[ID:BA18][EXPECT:Cap nhat ho so thanh cong va mo duoc trang don hang cua toi] updates buyer profile and opens orders page', async ({ page }) => {
    await login(page, buyer.email, buyer.password);
    await page.goto('/ho-so');
    await expect(page.locator('main')).toContainText(buyer.email);
    await page.locator('input[type="text"]').first().fill('Nguyen Van A');
    await page.locator('input[type="tel"]').fill('0909999999');
    await page.locator('textarea').first().fill('Dia chi cap nhat tu Playwright');
    await page.locator('main form').first().locator('button[type="submit"]').click();
    await expect(page.locator('main')).toContainText(/th.nh c.ng|success/i);

    await page.goto('/don-hang');
    await expect(page.locator('main')).toBeVisible();
    await page.locator('button').filter({ hasText: /all|T.t/i }).first().click();
  });

  test('[ID:BW-WALKIN-01][EXPECT:Guest checkout thanh cong, vao don-hang thi bi dieu huong den dang-nhap] buyer walk-in can checkout without login and cannot access my orders page', async ({ page, request }) => {
    const products = await apiData<Product[]>(request, '/products?admin=1');
    const guestProduct = products.find(
      (product) =>
        product.stock > 0 &&
        (product.status || 'active') === 'active' &&
        !product.name.includes('kiá»ƒm thá»­ Playwright')
    );
    expect(guestProduct, 'demo data should include an active product for guest checkout').toBeTruthy();

    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    await clearCart(page);
    await addProductToCart(page, guestProduct!);

    await page.locator('a[href="/thanh-toan"]').click();
    await page.locator('input[name="fullName"]').fill(`Guest Buyer ${Date.now()}`);
    await page.locator('input[name="phone"]').fill(`09366${String(Date.now()).slice(-5)}`);
    await page.locator('input[name="email"]').fill('guest-walkin@example.com');
    await page.locator('input[name="address"]').fill('456 Guest Street');
    await page.locator('select[name="city"]').selectOption('hcm');
    await page.locator('select[name="district"]').selectOption('q1');
    await page.locator('select[name="ward"]').selectOption('p1');
    await page.locator('textarea[name="note"]').fill('Guest checkout from Playwright');
    await page.locator('main form').first().locator('button[type="submit"]').click();
    await page.locator('main form').first().locator('button[type="submit"]').click();
    await page.locator('main').locator('button').last().click();
    await expect(page.locator('main')).toContainText(/th.nh c.ng|success/i);

    await page.goto('/don-hang');
    await expect(page).toHaveURL(/\/dang-nhap/);
    await expect(page.locator('main form').first()).toBeVisible();
  });

  test('[ID:BW02-FILTER-EDGE-01][EXPECT:Tim kiem loc sap xep va trang khong co ket qua hoat dong dung] searches, combines filters, sorts products, and handles empty results', async ({ page, request }) => {
    const products = await apiData<Product[]>(request, '/products?admin=1');
    const activeProducts = products.filter((product) => (product.status || 'active') === 'active');
    const target = activeProducts.find((product) => product.condition && product.category && product.stock > 0) || activeProducts[0];
    expect(target, 'need one active product for product-list coverage').toBeTruthy();

    await page.goto(`/san-pham?q=${encodeURIComponent(target.name)}`);
    await expect(page.locator('main')).toContainText(target.name);

    await page.goto(
      `/san-pham?category=${encodeURIComponent(target.category)}&condition=${encodeURIComponent(target.condition || '')}`
    );
    await expect(page.locator('main')).toContainText(/Danh|T/);
    await expect(page.locator('main')).toContainText(target.name);

    await page.locator('main select').first().selectOption('price-asc');
    const visiblePrices = await page.locator('main .text-primary.font-bold').allTextContents();
    const numericPrices = visiblePrices
      .map((value) => Number(value.replace(/[^\d]/g, '')))
      .filter((value) => value > 0);
    expect(numericPrices.slice(0, 3), 'price-asc sort should render low prices first').toEqual(
      [...numericPrices].sort((a, b) => a - b).slice(0, 3)
    );

    await page.goto('/san-pham?q=zzzz-no-product-e2e&minPrice=999999999');
    await expect(page.locator('main')).toContainText(/Kh.ng t.m|0 k.t qu|No/i);
  });

  test('[ID:BW05-DETAIL-EDGE-01][EXPECT:Chi tiet san pham hien review bien dong gia va gioi han so luong theo ton kho] shows product detail tabs and keeps quantity within stock bounds', async ({ page, request }) => {
    const target = await getActiveProductWithStock(request, 2);
    const tempBuyer = await createTempBuyer(request);
    const comment = `Detail edge review ${Date.now()}`;

    await apiLogin(request, tempBuyer.email, tempBuyer.password);
    await apiPost(request, '/reviews', { productId: target.id, rating: 4, comment });
    await apiLogout(request);

    await page.goto(`/san-pham/${target.id}`);
    await expect(page.locator('h1')).toContainText(target.name);

    const quantity = page.locator('main span.w-12.text-center.font-medium.text-heading').first();
    const minusButton = quantity.locator('xpath=preceding-sibling::button[1]');
    const plusButton = quantity.locator('xpath=following-sibling::button[1]');
    await plusButton.click();
    await expect(quantity).toContainText('2');
    for (let index = 0; index < target.stock - 2; index += 1) {
      await plusButton.click();
    }
    await expect(quantity).toContainText(String(target.stock));
    await expect(plusButton).toBeDisabled();
    for (let index = 0; index < target.stock - 1; index += 1) {
      await minusButton.click();
    }
    await expect(quantity).toContainText('1');
    await expect(minusButton).toBeDisabled();

    await page.getByRole('button', { name: /.nh gi./i }).first().click();
    await expect(page.locator('main')).toContainText(comment);
    await page.getByRole('button', { name: /Bi.n|gia|gi./i }).first().click();
    await expect(page.locator('main')).toContainText(/L.ch s|Bi.n|gi./i);
  });

  test('[ID:BA01-REGISTER-NEG-POS-01][EXPECT:Dang ky loi validate trung email va dang ky moi thanh cong] validates registration errors and creates a new buyer account', async ({ page, request }) => {
    await page.goto('/dang-nhap');
    await page.locator('main button').nth(1).click();
    const registerForm = page.locator('main form').first();

    await registerForm.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dang-nhap/);
    await expect(page.locator('main')).toContainText(/Vui|email|th/i);

    await registerForm.locator('input[type="text"]').fill('PW Register Negative');
    await registerForm.locator('input[type="email"]').fill(buyer.email);
    await registerForm.locator('input[type="tel"]').fill('0901222333');
    await registerForm.locator('input[type="password"]').nth(0).fill('123456');
    await registerForm.locator('input[type="password"]').nth(1).fill('654321');
    await registerForm.locator('button[type="submit"]').click();
    await expect(page.locator('main')).toContainText(/kh|match|xac|nh/i);

    await registerForm.locator('input[type="password"]').nth(1).fill('123456');
    await registerForm.locator('button[type="submit"]').click();
    await expect(page.locator('main')).toContainText(/t.n t.i|email|fail|kh/i);

    const unique = Date.now();
    await registerForm.locator('input[type="email"]').fill(`ui-register-${unique}@example.com`);
    await registerForm.locator('input[type="tel"]').fill(`09222${String(unique).slice(-5)}`);
    await registerForm.locator('button[type="submit"]').click();
    await expect(page).not.toHaveURL(/\/dang-nhap$/);

    await apiLogout(request);
  });

  test('[ID:BW-CHECKOUT-NEG-01][EXPECT:Checkout chan form thieu bat buoc va API tu choi vuot ton kho] blocks invalid checkout data and rejects over-stock orders', async ({ page, request }) => {
    const target = await getActiveProductWithStock(request, 1);

    await clearCart(page);
    await addProductToCart(page, target);
    await page.locator('a[href="/thanh-toan"]').click();
    await page.locator('main form').first().locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/thanh-toan/);
    await expect(page.locator('input[name="fullName"]')).toBeVisible();

    const failure = await apiExpectFailure(request, 'post', '/orders', {
      items: [{ productId: target.id, quantity: target.stock + 1 }],
      shippingInfo: {
        fullName: 'Over Stock Buyer',
        phone: '0900000001',
        email: 'overstock@example.com',
        address: '1 Stock Street',
        city: 'hcm',
        district: 'q1',
        ward: 'p1',
        note: 'over stock negative'
      },
      paymentMethod: 'cod'
    });
    expect(failure.status).toBe(422);
  });

  test('[ID:BA-ORDER-SECURITY-01][EXPECT:Buyer chi xem don cua minh va guest khong gui duoc huy don review] protects account-only order, cancel, and review APIs', async ({ request }) => {
    const { order } = await createBuyerOrderViaApi(request);
    const secondBuyer = await createTempBuyer(request);

    await apiLogin(request, secondBuyer.email, secondBuyer.password);
    expect((await apiExpectFailure(request, 'get', `/orders/${order.id}`)).status).toBe(403);
    expect((await apiExpectFailure(request, 'post', '/cancel-requests', { orderId: order.id, reason: 'Not mine' })).status).toBe(404);
    await apiLogout(request);

    expect(
      (await apiExpectFailure(request, 'post', '/reviews', {
        productId: order.items[0].productId,
        rating: 5,
        comment: 'Guest should not review'
      })).status
    ).toBe(401);
  });
});

test.describe('2HANDWORLD admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await login(page, admin.email, admin.password);
    await expect(page).toHaveURL(/\/admin/);
  });

  test('[ID:AD-MODULES-01][EXPECT:Mo duoc tat ca module admin va sidebar hien dung] opens every admin module', async ({ page }) => {
    for (const path of ['/admin', '/admin/san-pham', '/admin/danh-muc', '/admin/cua-hang', '/admin/noi-dung', '/admin/don-hang', '/admin/doanh-thu', '/admin/danh-gia', '/admin/nguoi-dung', '/admin/ton-kho']) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('aside')).toContainText('Admin');
    }
  });

  test('[ID:AD-PRODUCT-CRUD-01][EXPECT:Tao tim sua an san pham thanh cong va bang du lieu cap nhat dung] creates, searches, edits, and hides a product', async ({ page, request }) => {
    const products = await apiData<Product[]>(request, '/products?admin=1');
    const template = products[0];
    const testName = `Áo thun kiểm thử Playwright ${Date.now()}`;
    const editedName = `${testName} - đã cập nhật`;

    await page.goto('/admin/san-pham');
    await page.locator('button').filter({ hasText: /Th|Add|\+/i }).first().click();
    const modal = page.locator('.fixed').last();
    await modal.locator('input').nth(0).fill(testName);
    await modal.locator('select').first().selectOption(template.category);
    await modal.locator('input').nth(1).fill('Tốt');
    await modal.locator('input').nth(2).fill('199000');
    await modal.locator('input').nth(3).fill('100000');
    await modal.locator('input').nth(4).fill('5');
    await modal.locator('input').nth(6).fill(template.images[0]);
    await modal.locator('textarea').fill('San pham test tu Playwright');
    await page.locator('button').filter({ hasText: /L.u|Save/i }).last().click();
    await expect(page.locator('table')).toContainText(testName);

    await page.locator('input[placeholder]').first().fill(testName);
    await expect(page.locator('table tbody tr')).toHaveCount(1);

    await page.locator('table tbody tr').first().locator('button[title]').first().click();
    await page.locator('.fixed').last().locator('input').first().fill(editedName);
    await page.locator('button').filter({ hasText: /L.u|Save/i }).last().click();
    await expect(page.locator('table')).toContainText(editedName);

    await page.locator('table tbody tr').first().locator('button[title]').nth(1).click();
    await page.locator('.fixed button').last().click();
    await expect(page.locator('main')).toBeVisible();
  });

  test('[ID:AD-CATEGORY-CRUD-NEG-01][EXPECT:Danh muc bat buoc ten va co the tao sua xoa thanh cong] validates and manages categories', async ({ page }) => {
    const categoryName = `Danh muc E2E ${Date.now()}`;
    const editedName = `${categoryName} Edit`;

    await page.goto('/admin/danh-muc');
    await page.locator('button').filter({ hasText: /Th|Add|\+/i }).first().click();
    const createModal = page.locator('.fixed').last();
    await createModal.locator('button').filter({ hasText: /L.u|Save/i }).click();
    await expect(createModal).toBeVisible();

    await createModal.locator('input').first().fill(categoryName);
    await createModal.locator('button').filter({ hasText: /L.u|Save/i }).click();
    await expect(page.locator('table')).toContainText(categoryName);

    const createdRow = page.locator('table tbody tr').filter({ hasText: categoryName }).first();
    await createdRow.locator('button[title]').first().click();
    const editModal = page.locator('.fixed').last();
    await editModal.locator('input').first().fill(editedName);
    await editModal.locator('button').filter({ hasText: /L.u|Save/i }).click();
    await expect(page.locator('table')).toContainText(editedName);

    const editedRow = page.locator('table tbody tr').filter({ hasText: editedName }).first();
    await editedRow.locator('button[title]').nth(1).click();
    await page.locator('.fixed button').filter({ hasText: /X.a danh|Delete/i }).click();
    await expect(page.locator('table')).not.toContainText(editedName);
  });

  test('[ID:AD-USER-RISK-01][EXPECT:Admin gan VIP blacklist account va blacklist so dien thoai thanh cong] manages VIP and blacklist risk controls', async ({ page, request }) => {
    const tempBuyer = await createTempBuyer(request);
    const blacklistReason = `Account risk ${Date.now()}`;
    const blockedPhone = `09888${String(Date.now()).slice(-5)}`;

    await page.goto('/admin/nguoi-dung');
    const userRow = page.locator('table tbody tr').filter({ hasText: tempBuyer.email }).first();
    await expect(userRow).toBeVisible();
    await userRow.locator('button[title]').first().click();

    const detail = page.locator('.fixed.inset-0').last();
    await detail.locator('button').filter({ hasText: /VIP/i }).click();
    await expect(detail).toContainText('VIP');

    page.once('dialog', async (dialog) => {
      await dialog.accept(blacklistReason);
    });
    await detail.locator('button').filter({ hasText: /Blacklist/i }).click();
    await expect(detail).toContainText(/Blacklist/i);
    await expect(detail).toContainText(blacklistReason);

    await detail.locator('button').filter({ hasText: /Blacklist/i }).last().click();
    await expect(detail).toContainText(/Th|Normal|ng/i);

    await detail.locator('button').first().click();
    await page.locator('button').filter({ hasText: /Blacklist/i }).first().click();
    const phoneModal = page.locator('.fixed.inset-0').last();
    await phoneModal.locator('input[type="tel"]').fill(blockedPhone);
    await phoneModal.locator('textarea').fill(`Phone risk ${blockedPhone}`);
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain(blockedPhone);
      await dialog.accept();
    });
    await phoneModal.locator('button[type="submit"]').click();
    await expect(page.locator('.fixed.inset-0')).toHaveCount(0);
  });

  test('[ID:AD-INVENTORY-01][EXPECT:Loc tim kiem va cap nhat ton kho dong bo so luong moi] filters inventory and updates stock with an audit reason', async ({ page, request }) => {
    const created = await createProductViaApi(request);

    await page.goto('/admin/ton-kho');
    await page.locator('input[placeholder]').first().fill(created.name);
    const row = page.locator('table tbody tr').first();
    await expect(row).toContainText(created.name);
    await expect(row).toContainText('7');

    await row.locator('button').click();
    const modal = page.locator('.fixed').last();
    await modal.locator('input[type="number"]').nth(0).fill('2');
    await modal.locator('input[type="number"]').nth(1).fill('1');
    await modal.locator('textarea').fill(`Inventory audit ${Date.now()}`);
    await modal.locator('button').filter({ hasText: /C.p nh.t|Update/i }).last().click();
    await expect(row).toContainText('8');

    await page.locator('label').filter({ hasText: /s.p h.t|low/i }).locator('input').check();
    await expect(page.locator('main')).toBeVisible();
  });

  test('[ID:AD-REPORT-01][EXPECT:Bao cao doanh thu theo ngay thang va danh muc hien so lieu] displays revenue, profit, order, and category reports', async ({ page }) => {
    await page.goto('/admin/doanh-thu');
    await expect(page.locator('main')).toContainText(/Doanh thu/i);
    await expect(page.locator('main')).toContainText(/L.i nhu.n|profit/i);
    await expect(page.locator('table tbody tr').first()).toBeVisible();

    await page.locator('button').filter({ hasText: /ng.y|day/i }).click();
    await expect(page.locator('main')).toContainText(/theo ng.y|ng.y/i);
    await page.locator('button').filter({ hasText: /th.ng|month/i }).click();
    await expect(page.locator('main')).toContainText(/theo th.ng|th.ng/i);
  });

  test('[ID:AD-CONTENT-STORE-01][EXPECT:Quan ly cua hang va noi dung mo form nhap lieu va dong luu dung] opens store and content editing surfaces', async ({ page }) => {
    await page.goto('/admin/cua-hang');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
    await page.locator('button').filter({ hasText: /C.p nh.t|Update/i }).first().click();
    const storeModal = page.locator('.fixed.inset-0').last();
    await storeModal.locator('input[type="text"]').nth(0).fill('2HANDWORLD E2E');
    await storeModal.locator('input[type="text"]').nth(1).fill('123 Admin Store Street');
    await storeModal.locator('input[type="tel"]').fill('0909000000');
    await storeModal.locator('button').filter({ hasText: /L.u|Save/i }).last().click();
    await expect(page.locator('.fixed.inset-0')).toHaveCount(0);

    await page.goto('/admin/noi-dung');
    await page.locator('button').filter({ hasText: /Th.m|Add|\+/i }).first().click();
    const articleModal = page.locator('.fixed.inset-0').last();
    await articleModal.locator('input[type="text"]').nth(0).fill(`Article E2E ${Date.now()}`);
    await articleModal.locator('textarea').first().fill('Short article summary');
    await articleModal.locator('input[type="text"]').nth(1).fill('https://picsum.photos/seed/content-e2e/800/600');
    await articleModal.locator('textarea').nth(1).fill('Long article content from Playwright');
    await articleModal.locator('button').filter({ hasText: /L.u|Save/i }).last().click();
    await expect(page.locator('.fixed.inset-0')).toHaveCount(0);

    await page.locator('button').filter({ hasText: /Gi|about/i }).click();
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  test('[ID:AD10-PAYMENT-FAILED-01][EXPECT:Cap nhat payment failed va trang quan ly don hang hien dung trang thai] shows payment failed status in admin order management', async ({ page, request }) => {
    const { order } = await createBuyerOrderViaApi(request);

    await apiLogin(request, admin.email, admin.password);
    await apiPatch<Order>(request, `/orders/${order.id}/payment`, { status: 'failed' });
    await apiLogout(request);

    await page.goto('/admin/don-hang');
    await page.locator('input[placeholder]').first().fill(order.orderNumber);
    const row = page.locator('table tbody tr').first();
    await expect(row).toContainText(order.orderNumber);
    await expect(row).toContainText(/Th.t b.i|failed/i);
  });

  test('[ID:AD09-CANCEL-REQ-01][EXPECT:Yeu cau huy hien dung ly do buyer va admin xu ly tu choi/duyet dung trang thai] processes cancel request with buyer reason and admin rejection/approval', async ({ page, request }) => {
    const { order, buyer: orderOwner } = await createBuyerOrderViaApi(request);
    const buyerReason = `Khong the nhan hang - ${Date.now()}`;

    await apiLogin(request, orderOwner.email, orderOwner.password);
    await apiPost(request, '/cancel-requests', { orderId: order.id, reason: buyerReason });
    await apiLogout(request);

    await page.goto('/admin/don-hang');
    await page.getByRole('button', { name: /Y.u c.u h.y/i }).click();
    await page.locator('input[placeholder]').first().fill(order.orderNumber);
    const cancelRow = page.locator('table tbody tr').first();
    await expect(cancelRow).toContainText(order.orderNumber);
    await expect(cancelRow).toContainText(buyerReason);
    await cancelRow.locator('button').last().click();
    await expect(cancelRow).toContainText('Từ chối');

    const { order: secondOrder, buyer: secondOrderOwner } = await createBuyerOrderViaApi(request);
    const approveReason = `Doi dia chi giao hang - ${Date.now()}`;
    await apiLogin(request, secondOrderOwner.email, secondOrderOwner.password);
    await apiPost(request, '/cancel-requests', { orderId: secondOrder.id, reason: approveReason });
    await apiLogout(request);

    await page.reload();
    await page.getByRole('button', { name: /Y.u c.u h.y/i }).click();
    await page.locator('input[placeholder]').first().fill(secondOrder.orderNumber);
    const approveRow = page.locator('table tbody tr').first();
    await expect(approveRow).toContainText(secondOrder.orderNumber);
    await expect(approveRow).toContainText(approveReason);
    await approveRow.locator('button').first().click();
    await expect(approveRow).toContainText('Đã duyệt');
  });

  test('[ID:AD-RISK-01][EXPECT:Mo chi tiet don hang co canh bao blacklist va admin tu choi don duoc] shows blacklist warning and allows admin to reject risky order', async ({ page, request }) => {
    const { order } = await createBuyerOrderViaApi(request);
    expect(order.userId, 'order should include userId').toBeTruthy();

    await apiLogin(request, admin.email, admin.password);
    await apiPost(request, '/blacklist', { userId: order.userId, reason: `Risk control check ${Date.now()}` });
    await apiLogout(request);

    await page.goto('/admin/don-hang');
    await page.locator('input[placeholder]').first().fill(order.orderNumber);
    const row = page.locator('table tbody tr').first();
    await expect(row).toContainText(order.orderNumber);
    await row.locator('button[title]').first().click();

    const detail = page.locator('.fixed').last();
    await expect(detail).toContainText(/C.NH B.O R.I RO|Blacklist|danh s.ch .en/i);
    await detail.locator('button.bg-red-100').first().click();
    await expect(detail).toContainText(/B. t. ch.i|rejected/i);
  });

  test('[ID:AD-RISK-STATUS-01][EXPECT:User co status Blacklist van hien canh bao rui ro tren chi tiet don] shows risk warning when buyer status is blacklist without a blacklist row', async ({ page, request }) => {
    const { order } = await createBuyerOrderViaApi(request);
    expect(order.userId, 'order should include userId').toBeTruthy();

    await apiLogin(request, admin.email, admin.password);
    await apiPatch(request, `/users/${order.userId}/status`, { status: 'blacklisted' });
    await apiLogout(request);

    await page.goto('/admin/don-hang');
    await page.locator('input[placeholder]').first().fill(order.orderNumber);
    const row = page.locator('table tbody tr').first();
    await expect(row).toContainText(order.orderNumber);
    await row.locator('button[title]').first().click();

    const detail = page.locator('.fixed').last();
    await expect(detail).toContainText(/C.NH B.O R.I RO|Blacklist|danh s.ch .en/i);
    await expect(detail).toContainText(/tr.ng th.i Blacklist|Blacklist/i);
  });
});

test.describe('2HANDWORLD data propagation', () => {
  test('[ID:DP-PRODUCT-01][EXPECT:San pham moi hien thi dong bo o buyer list admin product va admin inventory] product change propagates to buyer list, admin product table, and inventory page', async ({ page, request }) => {
    const created = await createProductViaApi(request);

    await page.goto(`/san-pham?q=${encodeURIComponent(created.name)}`);
    await expect(page.locator('main')).toContainText(created.name);

    await login(page, admin.email, admin.password);
    await page.goto('/admin/san-pham');
    await page.locator('input[placeholder]').first().fill(created.name);
    await expect(page.locator('table')).toContainText(created.name);

    await page.goto('/admin/ton-kho');
    await page.locator('input[placeholder]').first().fill(created.name);
    const inventoryRow = page.locator('table tbody tr').first();
    await expect(inventoryRow).toContainText(created.name);
    await expect(inventoryRow).toContainText('7');
  });

  test('[ID:DP-ORDER-USER-01][EXPECT:Trang thai don va blacklist user dong bo sang order row va modal canh bao rui ro] order and user status changes propagate to order management and risk warning', async ({ page, request }) => {
    const { order } = await createBuyerOrderViaApi(request);
    expect(order.userId, 'order should include userId').toBeTruthy();

    await apiLogin(request, admin.email, admin.password);
    await apiPatch<Order>(request, `/orders/${order.id}/status`, { status: 'confirmed' });
    await apiPost(request, '/blacklist', { userId: order.userId, reason: `Propagation risk ${Date.now()}` });
    await apiLogout(request);

    await login(page, admin.email, admin.password);
    await page.goto('/admin/don-hang');
    await page.locator('input[placeholder]').first().fill(order.orderNumber);
    const row = page.locator('table tbody tr').first();
    await expect(row).toContainText(order.orderNumber);
    await expect(row).toContainText(/x.c nh.n|confirmed/i);
    await row.locator('button[title]').first().click();

    const detail = page.locator('.fixed').last();
    await expect(detail).toContainText(/C.NH B.O R.I RO|Blacklist|danh s.ch .en/i);
  });

  test('[ID:DP-REVIEW-01][EXPECT:Review moi hien tren buyer detail va bi an sau khi admin moderate] review status propagates between buyer product detail and admin review moderation', async ({ page, request }) => {
    const products = await apiData<Product[]>(request, '/products?admin=1');
    const target = products.find((product) => (product.status || 'active') === 'active');
    expect(target, 'need one active product for review propagation').toBeTruthy();

    const tempBuyer = await createTempBuyer(request);
    const comment = `Propagation review ${Date.now()}`;

    await apiLogin(request, tempBuyer.email, tempBuyer.password);
    await apiPost(request, '/reviews', { productId: target!.id, rating: 5, comment });
    await apiLogout(request);

    await page.goto(`/san-pham/${target!.id}`);
    await page.getByRole('button', { name: /.nh gi./i }).first().click();
    await expect(page.locator('main')).toContainText(comment);

    await login(page, admin.email, admin.password);
    await page.goto('/admin/danh-gia');
    await page.locator('input[placeholder]').first().fill(comment);
    const reviewRow = page.locator('table tbody tr').first();
    await expect(reviewRow).toContainText(comment);
    await reviewRow.locator('button[title]').first().click();
    await expect(reviewRow).toContainText(/. .n|hidden/i);

    await page.goto(`/san-pham/${target!.id}`);
    await page.getByRole('button', { name: /.nh gi./i }).first().click();
    await expect(page.locator('main')).not.toContainText(comment);
  });
});
