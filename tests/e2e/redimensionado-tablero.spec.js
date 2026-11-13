import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Redimensionado del tablero', () => {
  test('permite ampliar la altura del panel y la recuerda', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    const section = page.locator('section[aria-label="Orden de iniciativa"]');
    const handle = page.getByRole('separator', { name: 'Ajustar altura del tablero' });
    await expect(handle).toBeVisible();

    const before = (await section.boundingBox()).height;
    const box = await handle.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + 140, { steps: 6 });
    await page.mouse.up();

    const after = (await section.boundingBox()).height;
    expect(after).toBeGreaterThan(before);
    const stored = await page.evaluate(() => localStorage.getItem('trackBoardHeight'));
    expect(Number(stored)).toBeGreaterThan(0);

    await page.reload({ waitUntil: 'networkidle' });
    const reloadedHeight = (await page.locator('section[aria-label="Orden de iniciativa"]').boundingBox()).height;
    expect(reloadedHeight).toBeGreaterThan(before);
  });

  test('permite reducir la altura del panel', async ({ page }) => {
    await seedStorage(page, buildSeed());
    await openTracker(page);

    const section = page.locator('section[aria-label="Orden de iniciativa"]');
    const handle = page.getByRole('separator', { name: 'Ajustar altura del tablero' });
    const before = (await section.boundingBox()).height;

    const box = await handle.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y - 180, { steps: 6 });
    await page.mouse.up();

    const after = (await section.boundingBox()).height;
    expect(after).toBeLessThan(before);
  });
});
