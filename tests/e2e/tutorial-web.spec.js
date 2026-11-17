import { expect, test } from '@playwright/test';
import { buildSeed, seedStorage } from './helpers';

test('el tutorial web incluye el manual completo y cambia de idioma', async ({ page }) => {
  await seedStorage(page, buildSeed({ lang: JSON.stringify('es') }));
  await page.goto('./tutorial', { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { name: 'Tutorial completo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Imprimir / PDF' })).toBeVisible();
  await expect(page.locator('.tutorial-prose h2')).toHaveCount(22);
  await expect(page.locator('.tutorial-prose img')).toHaveCount(9);
  await expect.poll(async () => page.locator('.tutorial-prose .tutorial-diagram svg').count()).toBeGreaterThanOrEqual(3);
  await expect.poll(async () => page.locator('.tutorial-prose img').evaluateAll(
    (images) => images.filter((image) => image.complete && image.naturalWidth > 0).length,
  )).toBe(9);

  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Complete tutorial' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Print / PDF' })).toBeVisible();
  await expect(page.locator('.tutorial-prose h2')).toHaveCount(22);
  await expect.poll(async () => page.locator('.tutorial-prose img').evaluateAll(
    (images) => images.filter((image) => image.getAttribute('src')?.includes('/en/')).length,
  )).toBe(9);
});
