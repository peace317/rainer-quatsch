import { test as setup } from '@playwright/test';
import { ADMIN, USER } from '../../test-config/constants';

setup.beforeAll('presetup', async ({ browser  }) => {
    const page = await browser.newPage();
    // Keine Ahnung was das schon wieder los ist. Wenn man das nicht macht, dann klappt beim debuggen der erste Login nicht
    page.on('console', (msg) => console.log(msg.text()));
    await page.goto('/login');
    await page.getByLabel('username').fill(ADMIN.username);
    await page.getByRole('textbox', { name: 'password' }).fill(ADMIN.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.close();
});

setup('authenticate as admin', async ({ page }) => {
    page.on('console', (msg) => console.log(msg.text()));
    await page.goto('/login');
    await page.getByLabel('username').fill(ADMIN.username);
    await page.getByRole('textbox', { name: 'password' }).fill(ADMIN.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL('/dashboard');
    await page.context().storageState({ path: ADMIN.storageState });
});

setup('authenticate as user', async ({ page }) => {
    page.on('console', (msg) => console.log(msg.text()));
    await page.goto('/login');
    await page.getByLabel('username').fill(USER.username);
    await page.getByRole('textbox', { name: 'password' }).fill(USER.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL('/dashboard');

    await page.context().storageState({ path: USER.storageState });
});
