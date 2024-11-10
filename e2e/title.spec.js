import { test, expect } from '@playwright/test';
 
test('example', async ({ page }) => {
await page.goto('http://localhost:3000'); // Ensure the URL matches the app’s address
  expect(await page.title()).toBe('UCollab — Sign In'); // Replace 'UCollab' with the actual page title
});