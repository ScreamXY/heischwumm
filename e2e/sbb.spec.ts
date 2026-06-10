import { expect, test } from '@playwright/test';

import { mockApis } from './mock-apis';

test.beforeEach(async ({ page }) => {
  await mockApis(page);
});

test('searches connections between two stations', async ({ page }) => {
  await page.goto('/#/sbb');

  await page.getByPlaceholder('Von').fill('Bern');
  await page.getByPlaceholder('Nach').fill('Thun');

  await expect(page.locator('h2')).toHaveText('Bern - Thun');
  await expect(page.locator('app-connection')).toContainText('Bern - Thun');
  await expect(page.locator('app-connection')).toContainText('Abfahrt');
  await expect(page.locator('app-connection')).toContainText('Gleis');
});

test('does not search while a field is empty', async ({ page }) => {
  let connectionRequests = 0;
  await page.route('https://transport.opendata.ch/v1/connections*', (route) => {
    connectionRequests++;
    return route.fulfill({ json: { connections: [] } });
  });
  await page.goto('/#/sbb');

  await page.getByPlaceholder('Von').fill('Bern');
  await page.waitForTimeout(800);

  expect(connectionRequests).toBe(0);
  await expect(page.locator('h2')).toHaveCount(0);
});
