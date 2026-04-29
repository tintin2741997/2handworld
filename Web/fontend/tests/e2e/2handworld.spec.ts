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
  stock: number;
  status?: string;
  images: string[];
};

type Order = {
  id: string;
  orderNumber: string;
  userId?: string | null;
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

test.describe('2HAND WORLD buyer website', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('opens public pages and searches products', async ({ page }) => {
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

  test('validates login errors and logs buyer in/out', async ({ page }) => {
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

  test('adds cart item, updates quantity, and completes checkout', async ({ page, request }) => {
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

  test('updates buyer profile and opens orders page', async ({ page }) => {
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

  test('buyer walk-in can checkout without login and cannot access my orders page', async ({ page, request }) => {
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
});

test.describe('2HANDWORLD admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await login(page, admin.email, admin.password);
    await expect(page).toHaveURL(/\/admin/);
  });

  test('opens every admin module', async ({ page }) => {
    for (const path of ['/admin', '/admin/san-pham', '/admin/danh-muc', '/admin/cua-hang', '/admin/noi-dung', '/admin/don-hang', '/admin/doanh-thu', '/admin/danh-gia', '/admin/nguoi-dung', '/admin/ton-kho']) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('aside')).toContainText('Admin');
    }
  });

  test('creates, searches, edits, and hides a product', async ({ page, request }) => {
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

  test('shows payment failed status in admin order management', async ({ page, request }) => {
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

  test('processes cancel request with buyer reason and admin rejection/approval', async ({ page, request }) => {
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

  test('shows blacklist warning and allows admin to reject risky order', async ({ page, request }) => {
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
});

test.describe('2HANDWORLD data propagation', () => {
  test('product change propagates to buyer list, admin product table, and inventory page', async ({ page, request }) => {
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

  test('order and user status changes propagate to order management and risk warning', async ({ page, request }) => {
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

  test('review status propagates between buyer product detail and admin review moderation', async ({ page, request }) => {
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
