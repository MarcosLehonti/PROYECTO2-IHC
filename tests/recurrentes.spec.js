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

test.describe('Pruebas E2E - Gastos Recurrentes (Nueva Feature)', () => {

  test('Flujo Principal: Registrar gasto recurrente semanal, pagarlo y verificar generación automática de la siguiente ocurrencia', async ({ page }) => {
    // 1. Iniciar sesión
    await loginYEsperar(page);

    // 2. Abrir modal de nuevo movimiento
    await page.click('button.btn-new-mov');
    const modalGasto = page.locator('.modal-card.dashboard-modal-card').first();
    await expect(modalGasto).toBeVisible({ timeout: 5000 });

    // 3. Completar formulario con gasto recurrente
    await page.fill('input.input-cantidad', '25');
    await page.fill('input[placeholder*="Almuerzo"], input[placeholder*="Beca"]', 'Gimnasio Semanal');

    // Seleccionar mes Noviembre en el select de fecha
    await page.selectOption('.col-fecha-mes select', 'Noviembre');

    // Seleccionar recurrencia: semanal
    const selectRecurrencia = page.locator('#recurrencia-gasto');
    await expect(selectRecurrencia).toBeVisible({ timeout: 3000 });
    await selectRecurrencia.selectOption('semanal');

    // Captura 1: Formulario modal con recurrencia semanal seleccionada
    await page.screenshot({ path: `${EVIDENCIAS}/recurrentes-01-modal-formulario.png`, fullPage: true });

    // 4. Guardar y esperar respuesta del servidor
    const respCrear = page.waitForResponse(
      r => r.url().includes('/movimientos') && r.request().method() === 'POST' && (r.status() === 200 || r.status() === 201)
    );
    await page.click('button.btn-guardar-principal');
    await respCrear;

    // 5. Verificar que el modal se cerró
    await expect(modalGasto).not.toBeVisible({ timeout: 5000 });

    // 6. Verificar en la tabla que aparece el movimiento con su badge de recurrencia
    const filaGasto = page.locator('tr.fila-movimiento', { hasText: 'Gimnasio Semanal' }).first();
    await expect(filaGasto).toBeVisible({ timeout: 5000 });
    await expect(filaGasto.locator('.badge-recurrencia')).toContainText('semanal');
    await expect(filaGasto.locator('.badge-estado-pill')).toContainText('Pendiente');

    // Captura 2: Gasto semanal creado en la tabla en estado pendiente con badge
    await page.screenshot({ path: `${EVIDENCIAS}/recurrentes-02-gasto-creado.png`, fullPage: true });

    // 7. Marcar como pagado el gasto recurrente
    const respPagar = page.waitForResponse(
      r => r.url().includes('/movimientos/') && r.url().includes('/pagar') && r.status() === 200
    );
    await filaGasto.locator('.btn-marcar-pagado').click();
    await respPagar;

    // Recargar o esperar sincronización de lista
    await page.waitForTimeout(1000);

    // 8. Verificaciones posteriores:
    // a) Debe existir un "Gimnasio Semanal" en estado Pagado
    const filaPagada = page.locator('tr.fila-movimiento', { hasText: 'Gimnasio Semanal' })
      .filter({ has: page.locator('.badge-estado-pagado, .estado-pagado-check') });
    await expect(filaPagada.first()).toBeVisible({ timeout: 5000 });

    // b) Debe haberse generado AUTOMÁTICAMENTE una nueva fila de "Gimnasio Semanal" en estado Pendiente (+7 días)
    const filaNuevaPendiente = page.locator('tr.fila-movimiento', { hasText: 'Gimnasio Semanal' })
      .filter({ has: page.locator('.badge-estado-pendiente') });
    await expect(filaNuevaPendiente.first()).toBeVisible({ timeout: 5000 });

    // Captura 3: Gasto original pagado y nueva ocurrencia generada automáticamente
    await page.screenshot({ path: `${EVIDENCIAS}/recurrentes-03-siguiente-generado.png`, fullPage: true });

    console.log('✅ Gasto recurrente verificado: cuota pagada y siguiente ocurrencia generada automáticamente.');
  });

});

