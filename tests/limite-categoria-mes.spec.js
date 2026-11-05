// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';
import { runSeed } from './helpers/seed-helper.js';

const EVIDENCIAS = path.resolve('docs/evidencias/tarea-7');

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

test.describe('Pruebas E2E - Tarea 7: Límites por Categoría y Mes (Cálculo, Estados y Recálculo Dinámico)', () => {

  test.beforeEach(async () => {
    runSeed();
  });

  test.afterAll(async () => {
    runSeed();
  });

  test('Test 1: Visualizar gasto acumulado, saldo y estados (Dentro del límite, >=80% y Excedido)', async ({ page }) => {
    await loginYEsperar(page);

    // 1. Expandir panel de presupuestos por categoría
    const btnToggle = page.locator('button.btn-toggle-cat');
    await expect(btnToggle).toBeVisible({ timeout: 5000 });
    const respCat = page.waitForResponse(r => r.url().includes('/presupuestos-categoria') && r.status() === 200);
    await btnToggle.click();
    await respCat;

    const listaCat = page.locator('.cat-presupuestos-lista');
    await expect(listaCat).toBeVisible();

    // 2. Verificar Comida y Almuerzos: límite 150 Bs, gasto inicial 35 Bs -> dentro del límite
    const filaComida = listaCat.locator('.cat-pres-item').filter({ hasText: 'Comida y Almuerzos' });
    await expect(filaComida).toBeVisible();
    await expect(filaComida).toContainText('Gastado');
    await expect(filaComida).toContainText('Saldo');
    await expect(filaComida.locator('.badge-cat-ok')).toHaveText('Dentro del límite');

    // Captura 1: Estado inicial dentro del límite
    await page.screenshot({ path: `${EVIDENCIAS}/tarea7-01-estado-dentro-limite.png`, fullPage: true });

    // 3. Ajustar límite de Comida y Almuerzos a 40 Bs (como lleva 35 Bs gastados, 35/40 = 87.5% -> >=80%)
    page.once('dialog', async dialog => {
      await dialog.accept('40');
    });
    const respPostAlerta = page.waitForResponse(r => r.url().includes('/presupuestos-categoria') && r.status() === 200);
    await filaComida.locator('.btn-asignar-cat').click();
    await respPostAlerta;
    await page.waitForResponse(r => r.url().includes('/presupuestos-categoria') && r.status() === 200);

    // Verificar badge >=80%
    await expect(filaComida.locator('.badge-cat-alerta')).toHaveText('>=80%');
    await page.screenshot({ path: `${EVIDENCIAS}/tarea7-02-estado-alerta-80.png`, fullPage: true });

    // 4. Ajustar límite de Comida y Almuerzos a 30 Bs (como lleva 35 Bs gastados, 35 > 30 -> Excedido)
    page.once('dialog', async dialog => {
      await dialog.accept('30');
    });
    const respPostExcedido = page.waitForResponse(r => r.url().includes('/presupuestos-categoria') && r.status() === 200);
    await filaComida.locator('.btn-asignar-cat').click();
    await respPostExcedido;
    await page.waitForResponse(r => r.url().includes('/presupuestos-categoria') && r.status() === 200);

    // Verificar badge Excedido y saldo negativo
    await expect(filaComida.locator('.badge-cat-excedido')).toHaveText('Excedido');
    await expect(filaComida).toContainText('-5.00 Bs');
    await page.screenshot({ path: `${EVIDENCIAS}/tarea7-03-estado-excedido.png`, fullPage: true });
  });

  test('Test 2: Registrar, editar categoría/fecha y eliminar gasto recalcula automáticamente ambos presupuestos afectados', async ({ page }) => {
    await loginYEsperar(page);

    // 1. Expandir panel de categorías
    const btnToggle = page.locator('button.btn-toggle-cat');
    const respCat = page.waitForResponse(r => r.url().includes('/presupuestos-categoria') && r.status() === 200);
    await btnToggle.click();
    await respCat;

    const listaCat = page.locator('.cat-presupuestos-lista');
    const filaTransporte = listaCat.locator('.cat-pres-item').filter({ hasText: 'Transporte y Pasajes' });
    const filaComida = listaCat.locator('.cat-pres-item').filter({ hasText: 'Comida y Almuerzos' });

    // Asignar límite a Transporte y Pasajes de 100 Bs
    page.once('dialog', async dialog => {
      await dialog.accept('100');
    });
    const respSetTrans = page.waitForResponse(r => r.url().includes('/presupuestos-categoria') && r.status() === 200);
    await filaTransporte.locator('.btn-asignar-cat').click();
    await respSetTrans;
    await page.waitForResponse(r => r.url().includes('/presupuestos-categoria') && r.status() === 200);

    // Leer gasto actual de Transporte antes de registrar nuevo gasto
    const textoGastoTransAntes = await filaTransporte.locator('strong').first().textContent();
    const gastoTransInicial = parseFloat(textoGastoTransAntes?.replace(/[^\d.]/g, '') || '0');

    // 2. Registrar un gasto de 30 Bs en Transporte y Pasajes
    await page.click('button.btn-new-mov');
    await page.fill('input.input-cantidad', '30');
    await page.fill('input[placeholder*="Almuerzo"], input[placeholder*="Beca"]', 'Recarga Pasajes Metro');
    await page.selectOption('#categoria-gasto', 'Transporte y Pasajes');

    const respCrear = page.waitForResponse(r => r.url().includes('/movimientos') && r.request().method() === 'POST' && (r.status() === 200 || r.status() === 201));
    await page.click('button.btn-guardar-principal');
    await respCrear;

    // Verificar que el gasto de Transporte se recalculó sumando 30 Bs
    const nuevoGastoTransEsperado = (gastoTransInicial + 30).toFixed(2);
    await expect(filaTransporte).toContainText(`${nuevoGastoTransEsperado} Bs`, { timeout: 7000 });
    await page.screenshot({ path: `${EVIDENCIAS}/tarea7-04-gasto-registrado-recalculado.png`, fullPage: true });

    // 3. Editar el gasto recién creado: Moverlo de 'Transporte y Pasajes' a 'Comida y Almuerzos'
    const filaMovimiento = page.locator('tr.fila-movimiento', { hasText: 'Recarga Pasajes Metro' }).first();
    await filaMovimiento.locator('button.btn-editar').click();

    const selectEditarCat = page.locator('#editar-categoria');
    await expect(selectEditarCat).toBeVisible();
    await selectEditarCat.selectOption('Comida y Almuerzos');

    const respPut = page.waitForResponse(r => r.url().includes('/movimientos/') && r.request().method() === 'PUT' && r.status() === 200);
    await page.click('button.btn-guardar-principal');
    await respPut;

    // Verificar recálculo en AMBAS categorías:
    // Transporte debe restar 30 Bs
    await expect(filaTransporte).toContainText(`${gastoTransInicial.toFixed(2)} Bs`, { timeout: 7000 });
    // Comida debe haber sumado 30 Bs
    await expect(filaComida).toContainText('65.00 Bs', { timeout: 7000 });
    await page.screenshot({ path: `${EVIDENCIAS}/tarea7-05-mover-categoria-actualiza-ambas.png`, fullPage: true });

    // 4. Registrar un INGRESO de 100 Bs en Comida o Beca y verificar que NO altera el consumo de presupuesto
    await page.click('button.btn-new-mov');
    await page.click('button.btn-type:has-text("Ingreso")');
    await page.fill('input.input-cantidad', '100');
    await page.fill('input[placeholder*="Beca"], input[placeholder*="Almuerzo"]', 'Ingreso Extra Examen');
    const respIngreso = page.waitForResponse(r => r.url().includes('/movimientos') && r.request().method() === 'POST' && (r.status() === 200 || r.status() === 201));
    await page.click('button.btn-guardar-principal');
    await respIngreso;

    // El gasto en Comida debe seguir intacto en 65.00 Bs (el ingreso no consume presupuesto)
    await expect(filaComida).toContainText('65.00 Bs', { timeout: 7000 });
    await page.screenshot({ path: `${EVIDENCIAS}/tarea7-06-ingreso-no-altera-consumo.png`, fullPage: true });

    // 5. Eliminar el gasto de 30 Bs y verificar que Comida se vuelve a recalcular a 35.00 Bs
    const filaGastoMover = page.locator('tr.fila-movimiento', { hasText: 'Recarga Pasajes Metro' }).first();
    await filaGastoMover.locator('button.btn-eliminar').click();
    const respDelete = page.waitForResponse(r => r.url().includes('/movimientos/') && r.request().method() === 'DELETE' && (r.status() === 200 || r.status() === 204));
    await page.click('button.btn-confirmar-eliminar');
    await respDelete;

    // Comida vuelve a su gasto original de 35.00 Bs
    await expect(filaComida).toContainText('35.00 Bs', { timeout: 7000 });
    await page.screenshot({ path: `${EVIDENCIAS}/tarea7-07-eliminar-recalcula-presupuesto.png`, fullPage: true });
  });

});

