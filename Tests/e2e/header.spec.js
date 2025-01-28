import { test, expect } from '@playwright/test';

test.describe('Header Navigation', () => {
    test('Should display header and navigate correctly based on authentication state', async ({ page }) => {
        await page.goto('http://localhost:4200/home');

        await page.waitForSelector('div.topnav', { state: 'visible' });

        const logo = page.locator('.nav-logo');
        await expect(logo).toBeVisible();

        await logo.click();
        await expect(page).toHaveURL('http://localhost:4200/home');

        const homeLink = page.locator('a.nav-item:has-text("HOME")');
        const filmsLink = page.locator('a.nav-item:has-text("FILMS")');
        const reviewsLink = page.locator('a.nav-item:has-text("MY REVIEWS")');
        await expect(homeLink).toBeVisible();
        await expect(filmsLink).toBeVisible();
        await expect(reviewsLink).toBeVisible();

        await filmsLink.click();
        await expect(page).toHaveURL('http://localhost:4200/films');

        const loginButton = page.locator('a.login-btn');
        const logoutButton = page.locator('a.logout-btn');

        await expect(loginButton).toBeVisible();
        await expect(logoutButton).not.toBeVisible();

        await loginButton.click();
        await expect(page).toHaveURL('http://localhost:4200/login');

        await page.fill('input[name="uname"]', 'test@test.com');
        await page.fill('input[name="pword"]', 'test_password');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2500);

        await page.goto('http://localhost:4200/home');

        await expect(logoutButton).toBeVisible();
        await expect(loginButton).not.toBeVisible();

        await reviewsLink.click();
        await expect(page).toHaveURL('http://localhost:4200/reviews');

        await page.goto('http://localhost:4200/home');

        await logoutButton.click();
        await page.waitForTimeout(2500);
        await reviewsLink.click();
        await expect(page).toHaveURL('http://localhost:4200/login');
    });
});
