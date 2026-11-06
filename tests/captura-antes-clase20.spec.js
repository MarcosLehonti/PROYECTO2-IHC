// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const EVIDENCIAS = path.resolve('docs/evidencias/clase-20');

test('Capturas de Estado ANTES - Clase 20', async ({ page }) => {
  // 1. Iniciar sesión con marcos@gmail.com
  await page.goto('/login');
  await page.fill('input[type="email"]', 'marcos@gmail.com');
  await page.fill('input[type="password"]', '123456');

  const respuestaMovimientos = page.waitForResponse(
    resp => resp.url().includes('/movimientos') && resp.request().method() === 'GET' && resp.status() === 200
  );
  await page.click('button.btn-submit');
  await respuestaMovimientos;
  await page.waitForURL('**/movimientos');
  await page.waitForTimeout(1000);

  // Captura 1: Dashboard actual con sobrecarga visual (tarjetas, límite grande, tabla)
  await page.screenshot({ path: `${EVIDENCIAS}/clase20-antes-01-dashboard-ruido.png`, fullPage: false });

  // Captura 2: Abrir presupuestos por categoría (escondido dentro de la tarjeta de límite)
  const btnCat = page.locator('.btn-toggle-cat');
  if (await btnCat.isVisible()) {
    await btnCat.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${EVIDENCIAS}/clase20-antes-02-categorias-escondidas.png`, fullPage: false });
  }

  // Captura 3: Ir a Historial del mes (mostrando que no hay botón para volver con contexto)
  await page.goto('/historial');
  await page.waitForSelector('.historial-page');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${EVIDENCIAS}/clase20-antes-03-historial-sin-retorno.png`, fullPage: false });
});

