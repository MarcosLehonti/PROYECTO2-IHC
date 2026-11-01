// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const EVIDENCIAS = path.resolve('docs/evidencias/tarea-6');

test.describe('Pruebas E2E - Registrar Gastos', () => {

  test('Flujo Principal: Iniciar sesión, registrar un nuevo gasto y verificar que el total se incrementa', async ({ page }) => {
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

    // 2. Leer el monto inicial de la tarjeta "Gastos del Mes"
    const tarjetaGastos = page.locator('.summary-card:has-text("Gastos del Mes") .card-amount');
    await expect(tarjetaGastos).toBeVisible();
    const textoGastoInicial = await tarjetaGastos.textContent();
    const gastoInicial = parseFloat((textoGastoInicial || '0').replace(/[^\d.]/g, '')) || 0;
    console.log(`Gasto del mes inicial: ${gastoInicial.toFixed(2)} Bs`);

    // 3. Abrir el modal de registro (+ Registrar Movimiento)
    await page.click('button.btn-new-mov');
    const modalGasto = page.locator('.dashboard-modal-card');
    await expect(modalGasto).toBeVisible();

    // 4. Llenar los datos del nuevo gasto para el mes actual (Noviembre)
    const montoRegistrar = 15.0;
    await page.fill('input.input-cantidad', String(montoRegistrar));
    await page.fill('input[placeholder="Almuerzo"]', 'Fotocopias Guía IHC');
    await page.selectOption('.col-fecha-mes select', 'Noviembre');

    // Captura 1: Formulario lleno dentro del modal
    await page.screenshot({ path: `${EVIDENCIAS}/gasto-01-modal-formulario.png`, fullPage: true });

    // 5. Preparar la escucha del guardado (POST) y hacer clic en Guardar
    const respuestaPost = page.waitForResponse(
      resp => resp.url().includes('/movimientos') && resp.request().method() === 'POST' && (resp.status() === 200 || resp.status() === 201)
    );
    await page.click('button.btn-guardar-principal');
    await respuestaPost;

    // 6. Verificación: el nuevo monto debe reflejar exactamente (gastoInicial + montoRegistrar)
    const nuevoGastoEsperado = (gastoInicial + montoRegistrar).toFixed(2);
    console.log(`Gasto del mes esperado: ${nuevoGastoEsperado} Bs`);
    await expect(tarjetaGastos).toContainText(`${nuevoGastoEsperado} Bs`, { timeout: 10000 });

    // Captura 2: Dashboard actualizado con el nuevo total
    await page.screenshot({ path: `${EVIDENCIAS}/gasto-02-gasto-registrado.png`, fullPage: true });
    console.log('✅ Gasto registrado y total verificado con éxito');
  });

  test('Flujo Alternativo: Cancelar el registro no modifica el total de gastos ni agrega movimientos', async ({ page }) => {
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

    // 2. Leer el monto actual de "Gastos del Mes"
    const tarjetaGastos = page.locator('.summary-card:has-text("Gastos del Mes") .card-amount');
    await expect(tarjetaGastos).toBeVisible();
    const textoGastoAntes = await tarjetaGastos.textContent();

    // 3. Abrir el modal de nuevo movimiento
    await page.click('button.btn-new-mov');
    const modalGasto = page.locator('.dashboard-modal-card');
    await expect(modalGasto).toBeVisible();

    // 4. Llenar algunos datos pero pulsar Cancelar
    await page.fill('input.input-cantidad', '999');
    await page.fill('input[placeholder="Almuerzo"]', 'Gasto Cancelado por Usuario');
    await page.click('button.btn-cancelar-modal');

    // 5. Verificar que el modal se cerró y el monto se mantuvo intacto
    await expect(modalGasto).not.toBeVisible();
    await expect(tarjetaGastos).toHaveText(textoGastoAntes || '');

    // Captura 3: Modal cerrado sin cambios en el balance
    await page.screenshot({ path: `${EVIDENCIAS}/gasto-03-cancelar-registro.png`, fullPage: true });
    console.log('✅ Cancelación de registro verificada: saldo intacto');
  });

});
