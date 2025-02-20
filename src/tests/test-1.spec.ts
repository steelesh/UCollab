import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F');
  await page.getByRole('button', { name: 'Sign in with UC Credentials' }).click();
  await page.getByLabel('someone@example.com').fill('halverlt@mail.uc.edu');
  await page.getByLabel('someone@example.com').press('Enter');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('Username').fill('halverlt');
  await page.getByPlaceholder('Username').press('Tab');
});
