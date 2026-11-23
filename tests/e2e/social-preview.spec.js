import { expect, test } from '@playwright/test';

const previewUrl = 'https://jcarlosorte.github.io/DrunagorTurnTrackerV2/social-preview.jpg';

test('la vista previa social usa la nueva imagen y se sirve correctamente', async ({ page, baseURL }) => {
  await page.goto('./');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', previewUrl);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', previewUrl);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');

  const response = await page.request.get(new URL('social-preview.jpg', baseURL).toString());
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('image/jpeg');
  expect((await response.body()).length).toBeGreaterThan(50 * 1024);
});
