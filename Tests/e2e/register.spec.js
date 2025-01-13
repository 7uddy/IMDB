const { test, expect } = require('@playwright/test');

test('Register', async ({ page }) => {
  await page.goto('http://localhost:4200/register');

  await page.fill('input[name="name"]', 'test_name');
  await page.fill('input[name="uname"]', 'test@test.com');
  await page.fill('input[name="pword"]', 'test_password');
  await page.fill('input[name="confirmPword"]', 'test_password');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('http://localhost:4200/login');
});
