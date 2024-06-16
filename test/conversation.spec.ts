import { test, expect } from '@playwright/test';
import { ADMIN, USER } from '../test-config/constants';
import path from 'path';

test.describe('test messaging', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', (msg) => console.log(msg.text()));
    });
    test.use({ storageState: USER.storageState });

    test.fixme('should create messages', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page.getByText('Test Conversation')).toBeVisible();
        await page.getByText('Test Conversation').click();
        await page.waitForURL(/\/dashboard\/conversation\/\d+/);
        await expect(page.locator('#header')).toBeVisible();
        await page.locator('#inputForm').getByRole('paragraph').click();
        await page.locator('.ql-editor').fill('first message');
        await page.locator('#submitButton').click();
        await page.locator('.ql-editor').click();
        await page.locator('.ql-editor').fill('second message');
        await page.locator('#submitButton').click();
    });
});

test.describe('test creating conversation', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', (msg) => console.log(msg.text()));
    });
    test.use({ storageState: USER.storageState });

    test('create new conversation with two users', async ({ page }) => {
        await page.goto('/dashboard');
        await page.getByRole('navigation').getByRole('button').click();
        await page.locator('[id="newConversation\\:conversationTitleWrapper\\:inputtext"]').fill('New conversation');
        await page.getByRole('combobox').fill('lex');
        await page.getByRole('option', { name: 'Lex Luther' }).click();
        await page.locator('[id="newConversation\\:conversationDescriptionWrapper\\:inputtextarea"]').fill('test description');
        await page.getByLabel('Speichern').click();
        await page.waitForURL(/\/dashboard\/conversation\/\d+/);
        await expect(page.locator('#header')).toBeVisible();
        await expect(page.locator('#header')).toContainText('New conversation');
    });

    test('create new conversation and create guest users', async ({ page }) => {
        await page.goto('/dashboard');
        await page.getByRole('navigation').getByRole('button').click();
        await page.locator('[id="newConversation\\:conversationTitleWrapper\\:inputtext"]').fill('Create Conv with Guest User');
        await page.getByRole('combobox').fill('Lois Lane');
        await page.locator('#newUserButton').click();
        await page.getByLabel('Ja').click();
        await expect(page.locator('li').filter({ hasText: 'Lois Lane' })).toBeVisible();
        await page.locator('[id="newConversation\\:conversationDescriptionWrapper\\:inputtextarea"]').fill('test description');
        await page.getByLabel('Speichern').click();
        await page.waitForURL(/\/dashboard\/conversation\/\d+/);
        await expect(page.locator('#header')).toBeVisible();
        await expect(page.locator('#header')).toContainText('Create Conv with Guest User');
    });
});

test.describe('test delete conversation', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', (msg) => console.log(msg.text()));
    });
    test.use({ storageState: USER.storageState });

    test.fixme('create new conversation and delete it', async ({ page }) => {
        await page.goto('/dashboard');
        await page.getByRole('navigation').getByRole('button').click();
        await page.locator('[id="newConversation\\:conversationTitleWrapper\\:inputtext"]').fill('Deletable conversation');
        await page.getByRole('combobox').fill('lex');
        await page.getByRole('option', { name: 'Lex Luther' }).click();
        await page.locator('[id="newConversation\\:conversationDescriptionWrapper\\:inputtextarea"]').fill('test description');
        await page.getByLabel('Speichern').click();
        await page.waitForURL(/\/dashboard\/conversation\/\d+/);
        await expect(page.locator('#header')).toBeVisible();
        await expect(page.locator('#header')).toContainText('Deletable conversation');
        await page.locator('#header').getByRole('button').nth(2).click();
        await page.getByRole('menuitem', { name: 'Delete' }).getByLabel('Delete').click();
        await page.getByLabel('Ja').click();
        await page.waitForURL('/dashboard');
        await expect(page.getByText('Deletable conversation')).not.toBeVisible();
    });
});

test.describe('test file upload', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', (msg) => console.log(msg.text()));
    });
    test.use({ storageState: USER.storageState });

    test('simple file upload', async ({ page }) => {
        await page.goto('/dashboard');
        await page.getByText('Test Conversation').click();
        await page.waitForURL(/\/dashboard\/conversation\/\d+/);
        await page.locator('#header').getByRole('button').first().click();
        
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByText('Durchsuchen').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, '../test-config/test-file.png'));
        
        await expect(page.getByLabel('Insert Image')).toContainText('test-file.png9.133 KBpending');
        await page.getByLabel('Upload').click();
        await expect(page.getByRole('cell', { name: 'preview test-file.png' }).locator('div')).toBeVisible();
        await page.getByRole('cell', { name: 'C Clark Kent' }).click();
    });
});
