import { chromium, FullConfig } from '@playwright/test';
import LoginPage from '../ui/pages/login-page';
import uiPages from '../utils/uiPages';

async function globalSetup(config: FullConfig) {
  const user = process.env.USERNAME!;
  const password = process.env.PASSWORD!;
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch({ headless: true, timeout: 10000 });
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);

  await page.goto(baseURL+uiPages.login);
  await loginPage.doLogin(user, password);
  // Wait for navigation after login
  await page.waitForURL(/.*profile/, { timeout: 10000 }).catch(async () => {
    // If navigation fails, check for error message
    const errorMessage = await loginPage.messagePanel.textContent();
    if (errorMessage) {
      throw new Error(`Login failed: ${errorMessage}`);
    }
    throw new Error('Login failed: Did not navigate to profile page');
  });
  await loginPage.checkLoggedIn();
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;

// https://playwright.dev/docs/test-global-setup-teardown#capturing-trace-of-failures-during-global-setup
// https://playwright.dev/docs/trace-viewer
