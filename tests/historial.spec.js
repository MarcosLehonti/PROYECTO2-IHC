// @ts-check
import { test, expect } from '@playwright/test';
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

test.describe('Pruebas E2E - Ver Historial', () => {

  test('Flujo Principal: Navegar al historial y verificar movimientos del mes actual', async ({ page }) => {
    // 1. Login
    await loginYEsperar(page);

    // 2. Hacer clic en el link "Historial" del navbar
    const respHistorial = page.waitForResponse(
      r => r.url().includes('/historial') && r.status() === 200
    );
    await page.click('a[href="/historial"]');
    await respHistorial;
    await page.waitForURL('**/historial');

    // 3. Verificar que la página de historial cargó
    await expect(page.locator('h1.page-title')).toContainText('Historial', { timeout: 5000 });

    // Captura 1: página de historial cargada
    await page.screenshot({ path: `${EVIDENCIAS}/historial-01-pagina.png`, fullPage: true });

    // 4. Verificar que se muestra el mes actual en el título
    const mesTitulo = page.locator('h2.mes-titulo');
    await expect(mesTitulo).toBeVisible({ timeout: 5000 });

    // El mes debe ser "Noviembre" (mes de la semilla: 2026-11)
    await expect(mesTitulo).toContainText('Noviembre', { timeout: 5000 });

    // 5. Verificar que aparece el resumen del mes (ingresos, gastos, balance)
    const resumenMes = page.locator('.resumen-mes');
    await expect(resumenMes).toBeVisible({ timeout: 5000 });
    await expect(resumenMes.locator('.resumen-etiqueta').first()).toBeVisible();

    // 6. Verificar que aparecen movimientos agrupados por día
    const diasLista = page.locator('.dia');
    await expect(diasLista.first()).toBeVisible({ timeout: 5000 });

    // 7. Verificar que los movimientos de la semilla están presentes
    //    La semilla carga: Beca (ingreso), Almuerzo, Tarjeta de transporte
    await expect(page.locator('.mov-descripcion').filter({ hasText: 'Beca Universitaria' }).first()).toBeVisible({ timeout: 5000 });

    // Captura 2: historial con movimientos del mes
    await page.screenshot({ path: `${EVIDENCIAS}/historial-02-movimientos.png`, fullPage: true });

    console.log('✅ Historial del mes cargado correctamente con movimientos de Noviembre');
  });

  test('Flujo Alternativo: Navegar a mes anterior usando el botón de navegación', async ({ page }) => {
    // 1. Login
    await loginYEsperar(page);

    // 2. Ir a historial
    await page.click('a[href="/historial"]');
    await page.waitForURL('**/historial');
    await expect(page.locator('h2.mes-titulo')).toBeVisible({ timeout: 5000 });

    // 3. Hacer clic en el botón de mes anterior (flecha izquierda)
    const btnAnterior = page.locator('button.btn-mes').first();
    await btnAnterior.click();

    // 4. El título del mes debe cambiar (ya no dice "Noviembre")
    // Esperamos un cambio reactivo sin hacer waitForResponse porque es local
    await expect(page.locator('h2.mes-titulo')).not.toContainText('Noviembre', { timeout: 5000 });

    // 5. Debe aparecer el botón "Volver al mes actual"
    await expect(page.locator('button.btn-volver-mes')).toBeVisible({ timeout: 5000 });

    // Captura 3: mes anterior visible con botón de retorno
    await page.screenshot({ path: `${EVIDENCIAS}/historial-03-mes-anterior.png`, fullPage: true });

    console.log('✅ Navegación al mes anterior funciona y aparece botón "Volver al mes actual"');
  });

});

