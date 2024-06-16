import { test, expect } from '@playwright/test';
import { ADMIN, USER } from '../test-config/constants';

test.describe('navigations', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', (msg) => console.log(msg.text()));
    });
    
    test.use({ storageState: USER.storageState });

    test('should navigate to the login page', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('login').click();
        await page.waitForURL('/login');
        await expect(page.locator('body')).toContainText('Sign in to continue');
    });

    test('should navigate to calendar', async ({ page }) => {
        await page.goto('/dashboard/calendar');
        await expect(page.getByRole('button', { name: 'login' })).toHaveCount(0);
        await expect(page).toHaveURL('/dashboard/calendar');
    });

    test('should navigate to conversation', async ({ page }) => {
        await page.goto('/dashboard');
        await page.getByText('Test Conversation').click();
        await page.waitForURL(/\/dashboard\/conversation\/\d+/);
        await expect(page.locator('#header')).toBeVisible();
        await expect(page.locator('#header')).toContainText('Test Conversation');
    });
});