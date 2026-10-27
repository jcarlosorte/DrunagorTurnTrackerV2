import { expect, test } from '@playwright/test';
import { buildSeed, openTracker, seedStorage } from './helpers';

test.describe('Seguridad · CSP', () => {
  test('la política se sirve y no bloquea la aplicación', async ({ page }) => {
    await page.addInitScript(() => {
      window.__csp = [];
      document.addEventListener('securitypolicyviolation', (event) => {
        window.__csp.push(`${event.violatedDirective} ${event.blockedURI}`);
      });
    });
    await seedStorage(page, buildSeed());
    await openTracker(page);

    // El contenido se pinta: la política no ha bloqueado scripts ni estilos.
    await expect(page.locator('.track-slot')).toHaveCount(11);

    const csp = await page.evaluate(() => {
      const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      return {
        content: meta?.getAttribute('content') || '',
        violations: window.__csp || [],
      };
    });

    expect(csp.content).toContain("default-src 'self'");
    expect(csp.content).toContain("object-src 'none'");
    expect(csp.content).toContain("base-uri 'self'");
    expect(csp.violations).toEqual([]);

    // Abrir un modal tampoco genera violaciones.
    await page.locator('[role="button"][aria-label*="Vorn"]').first().click({ force: true });
    await page.waitForTimeout(400);
    const afterModal = await page.evaluate(() => window.__csp || []);
    expect(afterModal).toEqual([]);
  });
});
