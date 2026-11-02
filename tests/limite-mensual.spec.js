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

test.describe('Pruebas E2E - Definir Límite Mensual', () => {

  test('Flujo Principal: Cambiar el límite mensual y verificar actualización en el dashboard', async ({ page }) => {
    // 1. Login
    await loginYEsperar(page);

    // 2. Leer el límite ACTUAL que muestra el dashboard
    //    La semilla carga límite = 500 Bs; el span con clase amount-navy lo muestra
    const spanLimiteActual = page.locator('.limite-valor.amount-navy');
    await expect(spanLimiteActual).toBeVisible({ timeout: 5000 });
    const textoAntes = await spanLimiteActual.textContent();

    // Captura 1: dashboard antes de cambiar el límite
    await page.screenshot({ path: `${EVIDENCIAS}/limite-01-antes.png`, fullPage: true });

    // 3. Abrir modal de límite
    await page.click('button.btn-limite');

    // Esperar a que el modal de límite sea visible (tiene h2 "Límite mensual")
    const modalLimite = page.locator('.dashboard-modal-card').filter({ hasText: 'Límite mensual' });
    await expect(modalLimite).toBeVisible({ timeout: 5000 });

    // Captura 2: modal abierto con campo de límite
    await page.screenshot({ path: `${EVIDENCIAS}/limite-02-modal-abierto.png`, fullPage: true });

    // 4. Escribir nuevo valor de límite (600 Bs)
    await page.fill('#input-limite', '600');

    // 5. Verificar que aparece la proyección positiva (600 > gastado)
    await expect(page.locator('.proyeccion-disponible-ok')).toBeVisible({ timeout: 3000 });

    // Captura 3: proyección antes de guardar
    await page.screenshot({ path: `${EVIDENCIAS}/limite-03-proyeccion.png`, fullPage: true });

    // 6. Guardar límite y esperar respuesta de la API (el frontend usa PUT /limite)
    const respLimite = page.waitForResponse(
      r => r.url().includes('/limite') && r.request().method() === 'PUT' && r.status() === 200
    );
    await page.locator('.dashboard-modal-card').filter({ hasText: 'Límite mensual' })
      .locator('button.btn-guardar-principal').click();
    await respLimite;

    // 7. Modal debe cerrarse
    await expect(modalLimite).not.toBeVisible({ timeout: 5000 });

    // 8. El span de límite en el dashboard debe actualizarse a 600.00 Bs
    await expect(spanLimiteActual).toContainText('600', { timeout: 5000 });

    // Captura 4: dashboard actualizado con nuevo límite
    await page.screenshot({ path: `${EVIDENCIAS}/limite-04-actualizado.png`, fullPage: true });

    console.log(`✅ Límite actualizado: ${textoAntes?.trim()} → 600.00 Bs`);
  });

  test('Flujo Alternativo: Intentar guardar un límite menor al gasto actual muestra error', async ({ page }) => {
    // 1. Login
    await loginYEsperar(page);

    // 2. Abrir modal de límite
    await page.click('button.btn-limite');
    const modalLimite = page.locator('.dashboard-modal-card').filter({ hasText: 'Límite mensual' });
    await expect(modalLimite).toBeVisible({ timeout: 5000 });

    // 3. Escribir un límite MUY BAJO (1 Bs, menor que el gasto actual de la semilla ~55 Bs)
    await page.fill('#input-limite', '1');

    // 4. El error debe aparecer de inmediato (validación reactiva)
    //    o al intentar guardar
    const btnGuardar = modalLimite.locator('button.btn-guardar-principal');

    // Intentar guardar
    await btnGuardar.click();

    // 5. Verificar que aparece el mensaje de error #error-limite
    const errorLimite = page.locator('#error-limite');
    await expect(errorLimite).toBeVisible({ timeout: 5000 });
    await expect(errorLimite).toContainText(/no puede ser menor|menor que lo que ya gastaste|mayor a 0/i);

    // Captura 5: mensaje de error visible
    await page.screenshot({ path: `${EVIDENCIAS}/limite-05-error-limite.png`, fullPage: true });

    // 6. El modal NO debe haberse cerrado (el límite inválido fue rechazado)
    await expect(modalLimite).toBeVisible();

    console.log('✅ Error de límite inválido mostrado correctamente. El modal permaneció abierto.');
  });

});
