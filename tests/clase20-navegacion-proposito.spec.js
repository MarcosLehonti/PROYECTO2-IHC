// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const EVIDENCIAS = path.resolve('docs/evidencias/clase-20');

test.describe('Pruebas E2E - Clase 20: Navegación por Propósito y Retorno Contextual', () => {

  test('Verificar pestañas por propósito, filtrado directo de pendientes y retorno contextual', async ({ page }) => {
    // 1. Iniciar sesión con credenciales válidas
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

    // 2. Verificar que las pestañas por propósito están visibles
    const tabTodos = page.locator('#tab-todos');
    const tabPendientes = page.locator('#tab-pendientes');
    const tabCategorias = page.locator('#tab-categorias');

    await expect(tabTodos).toBeVisible();
    await expect(tabPendientes).toBeVisible();
    await expect(tabCategorias).toBeVisible();

    // Captura DESPUÉS 1: Vista principal con barra de pestañas por propósito
    await page.screenshot({ path: `${EVIDENCIAS}/clase20-despues-01-pestanas-proposito.png`, fullPage: false });

    // 3. Activar pestaña "Pendientes de pago"
    await tabPendientes.click();
    await page.waitForTimeout(500);

    // Verificar banner informativo de gastos pendientes
    const bannerPendientes = page.locator('.banner-seccion-pendientes');
    await expect(bannerPendientes).toBeVisible();
    await expect(bannerPendientes).toContainText('Gastos pendientes de pago');

    // Captura DESPUÉS 2: Vista enfocada en tareas reales (Gastos pendientes)
    await page.screenshot({ path: `${EVIDENCIAS}/clase20-despues-02-seccion-pendientes.png`, fullPage: false });

    // 4. Activar pestaña "Presupuesto por categoría"
    await tabCategorias.click();
    await page.waitForTimeout(600);
    const listaCat = page.locator('.cat-presupuestos-lista');
    await expect(listaCat).toBeVisible();

    // Captura DESPUÉS 3: Acceso directo y despejado a presupuestos por categoría
    await page.screenshot({ path: `${EVIDENCIAS}/clase20-despues-03-seccion-presupuestos.png`, fullPage: false });

    // 5. Navegar a /historial y probar retorno contextual
    await page.goto('/historial');
    await page.waitForSelector('.historial-page');
    await page.waitForTimeout(800);

    // Verificar presencia del botón contextual "← Volver a Mis Movimientos"
    const btnVolver = page.locator('.btn-volver-movimientos');
    await expect(btnVolver).toBeVisible();
    await expect(btnVolver).toContainText('Volver a Mis Movimientos');

    // Captura DESPUÉS 4: Botón de retorno contextual en Historial
    await page.screenshot({ path: `${EVIDENCIAS}/clase20-despues-04-historial-retorno-contextual.png`, fullPage: false });

    // 6. Hacer clic en volver y verificar que regresa a /movimientos
    await btnVolver.click();
    await page.waitForURL('**/movimientos');
    await expect(page.locator('.dashboard-header h1')).toContainText('Mis Movimientos');
  });

});

