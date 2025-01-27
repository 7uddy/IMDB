const { test, expect } = require('@playwright/test');

test.describe('Login Page', () => {

  test('Login with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    await page.fill('input[name="uname"]', 'invalidemail@example.com');

    await page.fill('input[name="pword"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    const errorMessage = await page.locator('.error');
    await expect(errorMessage).toHaveText('Invalid credentials');

  });

  test('Login with correct details', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    await page.fill('input[name="uname"]', 'test@test.com');
    await page.fill('input[name="pword"]', 'test_password');

    await page.click('button[type="submit"]');

    await page.waitForLoadState('load');

    await expect(page).toHaveURL('http://localhost:4200/home');

    const navbar = await page.locator('div.topnav');
    await expect(navbar).toBeVisible();
  });

  test('Navigate to register', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    await page.click('a.register-link-text');

    await expect(page).toHaveURL('http://localhost:4200/register');
  });
});
