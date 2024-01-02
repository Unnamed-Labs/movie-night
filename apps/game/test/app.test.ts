import { test, expect } from '@playwright/test';

test.setTimeout(35e3);

test('send message', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const header = page.getByRole('heading', { name: 'Movie Night' });
  await expect(header).toBeVisible();
});
