import { test, expect } from '@playwright/test';
import { ADMIN, USER } from '../test-config/constants';

test.describe('test login', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', (msg) => console.log(msg.text()));
    });
    test.use({ storageState: USER.storageState });

    test('should navigate to calendar', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page.getByRole('button', { name: 'login' })).toHaveCount(0);
        await expect(page).toHaveURL('/dashboard');
    });

    test('should login and go to dashboard', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByLabel('Sign In')).toBeVisible();
        await page.getByLabel('username').fill(USER.username);
        await page.getByRole('textbox', { name: 'password' }).fill(USER.password);
        await page.getByRole('button', { name: 'Sign in' }).click();
        await page.waitForURL('/dashboard');
        await expect(page).toHaveURL('/dashboard');
    });
});

test.describe('test registration', () => {
    test('should register new user', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Register').click();
        await page.getByPlaceholder('Email').fill('tester@testerheld.com');
        await page.getByPlaceholder('Displayname').fill('Testerheld');
        await page.getByPlaceholder('Username').fill('test');
        await page.getByPlaceholder('Password').fill('test');
        await page.getByLabel('I agree to the terms and').check();
        await page.getByLabel('Register').click();
        await page.waitForURL('/dashboard');
        await expect(page.getByRole('heading', { name: 'Select a chat or start a new' })).toBeVisible();
        await expect(page.locator('h6')).toContainText('Hello Testerheld');
    });

    test('should throw error for existing username', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Register').click();
        await page.getByPlaceholder('Email').fill('tester@testerheld.com');
        await page.getByPlaceholder('Displayname').fill('Testerheld');
        await page.getByPlaceholder('Username').fill(USER.username);
        await page.getByPlaceholder('Password').fill('test');
        await page.getByLabel('I agree to the terms and').check();
        await page.getByLabel('Register').click();
        await expect(page).toHaveURL('/register');
        await expect(page.getByRole('status')).toContainText('User already exists.');
    });
});
