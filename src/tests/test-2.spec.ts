import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F');
  await page.getByRole('link', { name: 'Accessibility' }).click();
  await page.getByRole('link', { name: 'Privacy' }).click();
  await page.getByRole('link', { name: 'License' }).click();
  await page.getByRole('link', { name: 'About Us' }).click();
  await page.getByRole('link', { name: 'Explore' }).click();
});
