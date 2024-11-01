const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:3000'); // Ensure the URL matches the app’s address
  expect(await page.title()).toBe('UCollab'); // Replace 'UCollab' with the actual page title
});
