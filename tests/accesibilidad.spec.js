// @ts-check
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import path from 'path';

const EVIDENCIAS = path.resolve('docs/evidencias/tarea-6');

/** Helper: login e ir a /movimientos */
async function loginYEsperar(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'marcos@gmail.com');
  await page.fill('input[type="password"]', '123456');

  const respMovimientos = page.waitForResponse(
    r => r.url().includes('/movimientos') && r.request().method() === 'GET' && r.status() === 200
  );
  await page.click('button.btn-submit');
  await respMovimientos;
  await page.waitForURL('**/movimientos');
}

test.describe('Pruebas E2E - Accesibilidad (axe-core)', () => {

  test('Página de login no tiene violaciones críticas de accesibilidad', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 5000 });

    // Captura 1: página de login para evidencia
    await page.screenshot({ path: `${EVIDENCIAS}/accesibilidad-01-login.png`, fullPage: true });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Filtrar solo violaciones de impacto crítico y serio
    const violacionesCriticas = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (violacionesCriticas.length > 0) {
      console.log('⚠️ Violaciones encontradas en /login:');
      violacionesCriticas.forEach(v => {
        console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
      });
    }

    expect(violacionesCriticas, `Violaciones críticas en /login: ${violacionesCriticas.map(v => v.id).join(', ')}`).toHaveLength(0);

    console.log(`✅ Login: sin violaciones críticas (${results.violations.length} menores ignoradas)`);
  });

  test('Página principal /movimientos no tiene violaciones críticas de accesibilidad', async ({ page }) => {
    await loginYEsperar(page);

    // Esperar que la tabla de movimientos esté visible
    await expect(page.locator('table')).toBeVisible({ timeout: 5000 });

    // Captura 2: página principal para evidencia
    await page.screenshot({ path: `${EVIDENCIAS}/accesibilidad-02-movimientos.png`, fullPage: true });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const violacionesCriticas = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (violacionesCriticas.length > 0) {
      console.log('⚠️ Violaciones encontradas en /movimientos:');
      violacionesCriticas.forEach(v => {
        console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
        v.nodes.forEach(n => console.log(`    → ${n.html}`));
      });
    }

    expect(violacionesCriticas, `Violaciones críticas en /movimientos: ${violacionesCriticas.map(v => v.id).join(', ')}`).toHaveLength(0);

    console.log(`✅ Movimientos: sin violaciones críticas (${results.violations.length} menores ignoradas)`);
  });

  test('Página de historial /historial no tiene violaciones críticas de accesibilidad', async ({ page }) => {
    await loginYEsperar(page);
    await page.click('a[href="/historial"]');
    await page.waitForURL('**/historial');
    await expect(page.locator('h1.page-title')).toBeVisible({ timeout: 5000 });

    // Captura 3: historial para evidencia
    await page.screenshot({ path: `${EVIDENCIAS}/accesibilidad-03-historial.png`, fullPage: true });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const violacionesCriticas = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (violacionesCriticas.length > 0) {
      console.log('⚠️ Violaciones encontradas en /historial:');
      violacionesCriticas.forEach(v => {
        console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
      });
    }

    expect(violacionesCriticas, `Violaciones críticas en /historial: ${violacionesCriticas.map(v => v.id).join(', ')}`).toHaveLength(0);

    console.log(`✅ Historial: sin violaciones críticas (${results.violations.length} menores ignoradas)`);
  });

});

