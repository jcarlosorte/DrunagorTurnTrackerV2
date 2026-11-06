import { test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test('tmp track heights', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await seedStorage(page, buildSeed());
  await openTracker(page);
  const info = async (label) => {
    const data = await page.evaluate(() => {
      const board = document.querySelector('[aria-label="Orden de iniciativa"]');
      const section = board?.closest('section');
      const outer = document.querySelector('.min-h-\\[100dvh\\]');
      const aside = document.querySelector('aside');
      const rect = (el) => el ? { top: el.getBoundingClientRect().top, height: el.getBoundingClientRect().height, scrollH: el.scrollHeight, clientH: el.clientHeight } : null;
      return {
        board: rect(board), section: rect(section), outer: rect(outer), aside: rect(aside),
        pageScroll: document.documentElement.scrollHeight, window: window.innerHeight,
      };
    });
    console.log(label, JSON.stringify(data));
  };
  await info('1440x900');
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.waitForTimeout(500);
  await info('1024x700');
  await page.screenshot({ path: 'tmp-track-1024.png' });
});
