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

  test('Should show review form when user is authenticated', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    
    await page.fill('input[name="uname"]', 'test@test.com');
    await page.fill('input[name="pword"]', 'test_password');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2500)

    
    await page.goto('http://localhost:4200/movie/238/review');
    await page.waitForSelector('div.review-container', { state: 'visible' });

    await page.waitForTimeout(2500);

    const textarea = page.locator('textarea[formControlName="reviewText"]');
    await textarea.fill('Great movie!');

    await page.click('button[type="cancel"]');

    await expect(page).toHaveURL('http://localhost:4200/movie/238');
});

  test('Should show login prompt when user is not authenticated', async ({ page }) => {
    await page.goto('http://localhost:4200/movie/238/review');

    await expect(page).toHaveURL('http://localhost:4200/login');
  });
});
