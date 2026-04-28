import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const API_BASE = 'http://127.0.0.1/2handworld/Web/backend/api';
const buyer = { email: 'nguyenvana@gmail.com', password: '123456' };
const admin = { email: 'admin@2hand.vn', password: 'admin123' };

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status?: string;
  images: string[];
};

async function apiData<T>(request: APIRequestContext, path: string): Promise<T> {
  const response = await request.get(`${API_BASE}${path}`);
  expect(response.ok(), `${path} should return 2xx`).toBeTruthy();
  const payload = await response.json();
  expect(payload.success, `${path} should return success=true`).toBeTruthy();
  return payload.data as T;
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

test.describe('2HANDWORLD buyer website', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('opens public pages and searches products', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toContainText('2HANDWORLD');
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
    const purchasableProduct = products.find(
      (product) =>
        product.stock > 2 &&
        (product.status || 'active') === 'active' &&
        !product.name.includes('kiểm thử Playwright')
    );
    expect(purchasableProduct, 'demo data should include an active product with stock').toBeTruthy();

    await login(page, buyer.email, buyer.password);
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
});
