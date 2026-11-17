import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test('los avisos activos se muestran apilados encima del track', async ({ page }) => {
  await seedStorage(page, buildSeed());
  await openTracker(page);

  await page.getByRole('button', { name: 'Runas', exact: true }).click();
  await page.getByRole('button', { name: 'Activa Invadidos' }).click();
  await page.getByRole('button', { name: 'Runas', exact: true }).click();

  const notice = page.getByRole('status').filter({ hasText: 'Invadidos' });
  await expect(notice).toBeVisible();
  const box = await notice.boundingBox();
  expect(box.y).toBeGreaterThan(60);
});
