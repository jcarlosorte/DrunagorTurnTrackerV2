import { expect, test } from '@playwright/test';
import { buildSeed, seedStorage } from './helpers';

test.describe('Aviso de héroes en Despertar', () => {
  test('marca los héroes de la caja base como no recomendados', async ({ page }) => {
    await seedStorage(page, {
      ...buildSeed(),
      mainBox: JSON.stringify('awakenings'),
      expansions: JSON.stringify(['base', 'apocalypse_awakenings']),
    });
    await page.goto('./tracker', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Selecciona tus héroes' }).click();

    const baseCard = page.locator('label').filter({ hasText: 'Vorn' }).first();
    await expect(baseCard.getByText('Se recomienda no usar')).toBeVisible();

    const awakeningsCard = page.locator('label').filter({ hasText: 'Andreas' }).first();
    await expect(awakeningsCard.getByText('Se recomienda no usar')).toHaveCount(0);
  });
});
