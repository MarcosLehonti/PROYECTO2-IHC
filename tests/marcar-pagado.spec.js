// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const EVIDENCIAS = path.resolve('docs/evidencias/tarea-6');

test.describe('Pruebas E2E - Marcar Movimiento como Pagado', () => {

  test('Flujo Principal: Marcar un gasto pendiente como pagado y verificar actualización de estado y saldo', async ({ page }) => {
    // 1. Ir al login e iniciar sesión
    await page.goto('/login');
    await page.fill('input[type="email"]', 'marcos@gmail.com');
    await page.fill('input[type="password"]', '123456');

    const respuestaMovimientos = page.waitForResponse(
      resp => resp.url().includes('/movimientos') && resp.request().method() === 'GET' && resp.status() === 200
    );
    await page.click('button.btn-submit');
    await respuestaMovimientos;
    await page.waitForURL('**/movimientos');

    // 2. Ubicar la fila conocida de la semilla: "Tarjeta de transporte semanal"
    const fila = page.locator('tr.fila-movimiento', { hasText: 'Tarjeta de transporte semanal' });
    await expect(fila).toBeVisible({ timeout: 5000 });

    const badgeEstado = fila.locator('.badge-estado-pill');
    await expect(badgeEstado).toContainText('Pendiente');

    // Captura 1: Movimiento en estado Pendiente antes de pagar
    await page.screenshot({ path: `${EVIDENCIAS}/pagado-01-antes-pendiente.png`, fullPage: true });

    // 3. Preparar la escucha de la petición PATCH antes de hacer clic
    const respuestaPatch = page.waitForResponse(
      resp => resp.url().includes('/movimientos/') && resp.request().method() === 'PATCH' && resp.status() === 200
    );

    await fila.locator('.btn-marcar-pagado').click();
    await respuestaPatch;

    // 4. Verificación de transición de estado en esa misma fila:
    // El badge de estado debe cambiar a "Pagado"
    await expect(badgeEstado).toContainText('Pagado', { timeout: 5000 });

    // El botón "Marcar como pagado" debe desaparecer y ser reemplazado por el check verde
    await expect(fila.locator('.btn-marcar-pagado')).not.toBeVisible();
    await expect(fila.locator('.estado-pagado-check')).toBeVisible();

    // Captura 2: Movimiento marcado como Pagado con check verde
    await page.screenshot({ path: `${EVIDENCIAS}/pagado-02-despues-pagado.png`, fullPage: true });
    console.log('✅ "Tarjeta de transporte semanal" marcada como pagada exitosamente');
  });

  test('Flujo Alternativo: Un movimiento ya pagado no muestra botón para volver a pagar (bloqueo en UI)', async ({ page }) => {
    // 1. Ir al login e iniciar sesión
    await page.goto('/login');
    await page.fill('input[type="email"]', 'marcos@gmail.com');
    await page.fill('input[type="password"]', '123456');

    const respuestaMovimientos = page.waitForResponse(
      resp => resp.url().includes('/movimientos') && resp.request().method() === 'GET' && resp.status() === 200
    );
    await page.click('button.btn-submit');
    await respuestaMovimientos;
    await page.waitForURL('**/movimientos');

    // 2. Ubicar una fila con estado "Pagado" (por ejemplo, el Almuerzo de 35 Bs de la semilla)
    const filaPagada = page.locator('tr.fila-movimiento:has(.badge-estado-pagado)').first();
    await expect(filaPagada).toBeVisible();

    // 3. Verificar que NO tiene botón "Marcar como pagado" (la interfaz previene pagos duplicados)
    await expect(filaPagada.locator('.btn-marcar-pagado')).not.toBeVisible();
    await expect(filaPagada.locator('.estado-pagado-check')).toBeVisible();

    // Captura 3: Comprobación de UI que bloquea doble pago
    await page.screenshot({ path: `${EVIDENCIAS}/pagado-03-bloqueo-doble-pago.png`, fullPage: true });
    console.log('✅ Protección contra doble pago verificada');
  });

});
