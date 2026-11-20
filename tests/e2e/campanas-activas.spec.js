import { expect, test } from '@playwright/test';
import { buildSeed, seedStorage } from './helpers';

test('una campaña sin su expansión activa no se puede seleccionar al iniciar', async ({ page }) => {
  await seedStorage(page, buildSeed({
    mainBox: JSON.stringify('apocalypse'),
    expansions: JSON.stringify(['base']),
  }));
  await page.goto('./tracker', { waitUntil: 'networkidle' });

  await expect(page.getByRole('button', { name: /Apocalipsis/ })).toBeDisabled();
  await expect(page.getByRole('button', { name: /Juego Base/ })).toHaveAttribute('aria-pressed', 'true');
});
