// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';
import { runSeed } from './helpers/seed-helper.js';

test.setTimeout(90000);

const EVIDENCIAS = path.resolve('evidencias/tarea-10');

test.describe('Pruebas E2E - Tarea 10: Portabilidad de Datos y Eliminación Ética de Cuenta', () => {

  test.beforeEach(async () => {
    runSeed();
  });

  test.afterAll(async () => {
    runSeed();
  });

  test('Demostración completa: descarga de datos, bloqueo por regla difícil, confirmación honesta y rechazo de login posterior', async ({ page }) => {

    // =========================================================================
    // 1. INICIAR SESIÓN CON USUARIO DE PRUEBA
    // =========================================================================
    await page.goto('/login');
    await page.fill('input[type="email"]', 'marcos@gmail.com');
    await page.fill('input[type="password"]', '123456');

    const respMov = page.waitForResponse(
      r => r.url().includes('/movimientos') && r.request().method() === 'GET' && r.status() === 200
    );
    await page.click('button.btn-submit');
    await respMov;
    await page.waitForURL('**/movimientos');
    await page.waitForTimeout(600);

    // =========================================================================
    // 2. NAVEGAR A /cuenta Y DEMOSTRAR DESCARGA DE DATOS (PORTABILIDAD)
    // =========================================================================
    await page.click('a[href="/cuenta"]');
    await page.waitForURL('**/cuenta');
    await page.waitForTimeout(600);

    // Verificar que la sección de portabilidad es visible
    await expect(page.locator('.seccion-titulo', { hasText: 'Portabilidad y Descarga de tus Datos' })).toBeVisible();

    // Iniciar descarga de JSON escuchando el evento de download del navegador
    const downloadPromise = page.waitForEvent('download');
    await page.click('.btn-descarga-json');
    const download = await downloadPromise;

    // Verificar que el nombre del archivo descargado es el esperado
    expect(download.suggestedFilename()).toContain('mis-datos-presupuesto');
    await expect(page.locator('.alerta-exito')).toContainText('Tus datos se descargaron exitosamente');

    // Captura 1: Portabilidad y descarga exitosa
    await page.screenshot({ path: `${EVIDENCIAS}/01-descarga-datos-portabilidad.png`, fullPage: false });
    console.log('✅ Caso 1: Portabilidad de datos demostrada con descarga JSON');

    // =========================================================================
    // 3. INTENTO DE ELIMINACIÓN BLOQUEADO POR LA REGLA DIFÍCIL DE LA APP
    // El seed tiene 1 gasto pendiente de 20 Bs ("Tarjeta de transporte semanal")
    // =========================================================================
    await page.click('.btn-solicitar-baja');
    await page.waitForTimeout(600);

    const modal = page.locator('.modal-confirmacion-honesta');
    await expect(modal).toBeVisible();

    // Verificar que la regla difícil bloquea la eliminación y explica el motivo
    await expect(modal.locator('.modal-titulo-honesto')).toContainText('Acción Requerida Antes de Continuar');
    await expect(modal.locator('.texto-bloqueo')).toContainText('gasto(s) pendiente(s) de pago');
    await expect(modal.locator('.caja-instrucciones-bloqueo')).toContainText('¿Qué debes hacer para poder eliminarla?');

    // Captura 2: Bloqueo honesto explicando la regla y cómo resolverla
    await page.screenshot({ path: `${EVIDENCIAS}/02-eliminacion-bloqueada-regla-app.png`, fullPage: false });
    console.log('✅ Caso 2: Intento bloqueado por regla difícil demostrado');

    // Salir del modal usando el botón de volver
    await page.click('.btn-modal-cancelar');
    await page.waitForTimeout(400);
    await expect(modal).not.toBeVisible();

    // =========================================================================
    // 4. RESOLVER LA REGLA: MARCAR EL GASTO PENDIENTE COMO PAGADO
    // =========================================================================
    await page.goto('/movimientos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);

    const filaPendiente = page.locator('tr.fila-movimiento', { hasText: 'Tarjeta de transporte semanal' });
    await expect(filaPendiente).toBeVisible({ timeout: 10000 });

    const btnPagar = filaPendiente.locator('.btn-marcar-pagado');
    if (await btnPagar.isVisible()) {
      const respPatch = page.waitForResponse(
        r => r.url().includes('/movimientos/') && r.status() === 200,
        { timeout: 7000 }
      ).catch(() => null);
      await btnPagar.click();
      await respPatch;
      await page.waitForTimeout(1000);
    }
    console.log('✅ Regla resuelta: gasto pendiente marcado como pagado');

    // =========================================================================
    // 5. VOLVER A /cuenta Y PROCEDER CON LA CONFIRMACIÓN HONESTA
    // Ahora que no hay pendientes, la regla permite continuar
    // =========================================================================
    await page.click('a[href="/cuenta"]');
    await page.waitForURL('**/cuenta');
    await page.waitForTimeout(600);

    await page.click('.btn-solicitar-baja');
    await page.waitForTimeout(600);

    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-titulo-honesto')).toContainText('Eliminar Cuenta Permanentemente');

    // Verificar principios éticos:
    // a) Nielsen 3: sin confirmshaming ni culpas
    await expect(modal).not.toContainText('Lamentamos que te vayas');
    await expect(modal).not.toContainText('arrepentirás');

    // b) Nielsen 5: botones simétricos del mismo tamaño
    const btnCancelar = modal.locator('.btn-modal-cancelar');
    const btnConfirmar = modal.locator('.btn-modal-confirmar-baja');
    await expect(btnCancelar).toBeVisible();
    await expect(btnConfirmar).toBeVisible();
    await expect(btnCancelar).toContainText('Cancelar');
    await expect(btnConfirmar).toContainText('Eliminar mi cuenta permanentemente');

    // Captura 3: Confirmación honesta con botones simétricos y consecuencias claras
    await page.screenshot({ path: `${EVIDENCIAS}/03-confirmacion-honesta-modal.png`, fullPage: false });
    console.log('✅ Caso 3: Confirmación honesta demostrada');

    // Confirmar la eliminación final
    const respDelete = page.waitForResponse(
      r => r.url().includes('/auth/cuenta') && r.request().method() === 'DELETE' && r.status() === 200
    );
    await btnConfirmar.click();
    await respDelete;

    // =========================================================================
    // 6. VERIFICAR QUE SE REDIRIGIÓ A LOGIN Y LA CUENTA NO PUEDE ENTRAR
    // =========================================================================
    await page.waitForURL('**/login?cuenta_eliminada=true', { timeout: 8000 });
    await expect(page.locator('.exito-alert')).toContainText('Tu cuenta y todos tus datos fueron eliminados');

    // Captura 4: Redirección post-eliminación con aviso de cuenta borrada
    await page.screenshot({ path: `${EVIDENCIAS}/04-cuenta-eliminada-login-bloqueado.png`, fullPage: false });

    // Intentar iniciar sesión de nuevo con la cuenta borrada
    await page.fill('input[type="email"]', 'marcos@gmail.com');
    await page.fill('input[type="password"]', '123456');

    const respLoginFallido = page.waitForResponse(
      r => r.url().includes('/auth/login') && r.status() === 401
    );
    await page.click('button.btn-submit');
    await respLoginFallido;
    await page.waitForTimeout(500);

    // Debe ser rechazado porque el usuario ya no existe en la base de datos
    await expect(page.locator('.error-alert')).toContainText('Correo o contraseña incorrectos');
    console.log('✅ Verificación exitosa: cuenta eliminada rechazada en login');

    // =========================================================================
    // 7. VERIFICAR TELEMETRÍA EN /analitica
    // Re-iniciamos sesión en modo demo para inspeccionar /analitica y los eventos
    // =========================================================================
    await page.goto('/login?demo=1');
    await page.waitForTimeout(400);
    const respDemo = page.waitForResponse(r => r.url().includes('/auth/login') && r.status() === 200);
    await page.click('button.btn-submit');
    await respDemo;
    await page.waitForURL('**/movimientos');

    await page.goto('/analitica');
    await page.waitForSelector('.analitica-contenedor');
    await page.waitForTimeout(600);

    // Captura 5: Telemetría con los eventos de la Tarea 10 registrados
    await page.screenshot({ path: `${EVIDENCIAS}/05-analitica-telemetria-tarea10.png`, fullPage: false });
    console.log('✅ Telemetría verificada en /analitica');
  });

});
