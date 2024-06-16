import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const isLocalTest = process.env.TEST_ENV !== 'production';
const command = isLocalTest ? 'dev --turbo' : 'start';

dotenv.config({ path: path.resolve(__dirname, '.env.test'), override: true });

const PORT = parseInt(process.env.ENV_PORT, 10) || 3000;
// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './test',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',

    globalSetup: require.resolve('./test-config/global-setup'),
    globalTeardown: require.resolve('./test-config/global-setup'),

    // Run your local dev server before starting the tests:
    // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
    webServer: [
        {
            command: `npx next ${command} --port=${PORT}`,
            url: baseURL,
            timeout: 120 * 1000,
            reuseExistingServer: !process.env.CI,
            stdout: 'pipe',
            stderr: 'pipe'
        },
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        // Use baseURL so to make navigations relative.
        baseURL,
        // Retry a test if its failing with enabled tracing. This allows you to analyze the DOM, console logs, network traffic etc.
        // More information: https://playwright.dev/docs/trace-viewer
        trace: 'retry-with-trace'
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'setup user',
            testMatch: /utils\/setup-user\.ts/,
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup user']
        }
        /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
*/
        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ]
});
