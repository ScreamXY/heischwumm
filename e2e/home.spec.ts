import { expect, test } from '@playwright/test';

import { localTime, mockApis } from './mock-apis';

test.beforeEach(async ({ page }) => {
  await mockApis(page);
});

test('shows the title and the reload counter', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');

  await expect(page.locator('h1.title')).toHaveText('Heischwumm');
  await expect(page.locator('button.refresh')).toContainText('5:00');
});

test('shows both SBB connection cards with departures, platforms and delays', async ({ page }) => {
  await page.goto('/');

  const thunCard = page.locator('.container.sbb').filter({ hasText: 'Thun' });
  await expect(thunCard).toContainText('Gümligen - Thun');
  await expect(thunCard).toContainText('Abfahrt');
  await expect(thunCard).toContainText('Gleis');
  await expect(thunCard).toContainText(`${localTime(1781088960)} (+1)`);
  await expect(thunCard).toContainText(localTime(1781090280));

  const muriCard = page.locator('.container.sbb').filter({ hasText: 'Muri' });
  await expect(muriCard).toContainText('Gümligen - Muri bei Bern');
});

test('shows the weather card with the Open-Meteo data', async ({ page }) => {
  await page.goto('/');

  const weatherCard = page.locator('.container.weather');
  await expect(weatherCard).toContainText('Luft Bern');
  await expect(weatherCard).toContainText('Leichter Regen');
  await expect(weatherCard).toContainText(localTime(1781062538));
  await expect(weatherCard).toContainText(localTime(1781119430));
  await expect(weatherCard).toContainText('14.27°C');
  await expect(weatherCard).toContainText('15.64°C');
  await expect(weatherCard).toContainText('13.61°C');
  await expect(weatherCard).toContainText('1019 hPa');
  await expect(weatherCard).toContainText('78%');
  await expect(weatherCard).toContainText('2.24 km/h');

  const icon = weatherCard.locator('img.weather-icon');
  await expect(icon).toHaveAttribute('src', 'images/10d.svg');

  await expect(weatherCard.locator('a[href="https://open-meteo.com/"]')).toBeVisible();
});

test('shows the Aare card with the required attribution links', async ({ page }) => {
  await page.goto('/');

  const aareCard = page.locator('.container.aare');
  await expect(aareCard).toContainText('Wasser Aare');
  await expect(aareCard).toContainText('16.1°C');
  await expect(aareCard).toContainText('146 m3/s');

  await expect(aareCard.locator('a[href="https://aare.guru"]')).toBeVisible();
  await expect(aareCard.locator('a[href="https://www.hydrodaten.admin.ch"]')).toBeVisible();
});

test('counts down and resets the counter on refresh click', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');

  await expect(page.locator('button.refresh')).toContainText('5:00');

  await page.clock.runFor(61_000);
  await expect(page.locator('button.refresh')).toContainText('3:59');

  await page.locator('button.refresh').click();
  await expect(page.locator('button.refresh')).toContainText('5:00');
});

test('reloads the data automatically after five minutes', async ({ page }) => {
  await page.clock.install();
  let aareRequests = 0;
  await page.route('https://aareguru.existenz.ch/v2018/current*', (route) => {
    aareRequests++;
    return route.fulfill({
      json: { aare: { timestamp: 1781088000, temperature: 16.1, flow: 146 } },
    });
  });
  await page.goto('/');
  await expect(page.locator('.container.aare')).toContainText('16.1°C');
  expect(aareRequests).toBe(1);

  await page.clock.runFor(302_000);

  await expect.poll(() => aareRequests).toBe(2);
  // The clock keeps running in real time after runFor, so the counter has
  // reset to 5:00 and may already have ticked a few seconds further.
  await expect(page.locator('button.refresh')).toContainText(/5:00|4:5\d/);
});

test('shows spinners while the data is loading', async ({ page }) => {
  await page.route('https://transport.opendata.ch/v1/connections*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    return route.fulfill({ json: { connections: [] } });
  });
  await page.goto('/');

  await expect(page.locator('app-progress-spinner').first()).toBeVisible();
});
