// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const EVIDENCIAS = path.resolve('docs/evidencias/tarea-6');

test.describe('Pruebas E2E - Editar y Eliminar Movimientos', () => {

  test('Flujo Principal: Editar la descripción de un movimiento existente', async ({ page }) => {
    // 1. Iniciar sesión
    await page.goto('/login');
    await page.fill('input[type="email"]', 'marcos@gmail.com');
    await page.fill('input[type="password"]', '123456');

    const respuestaMovimientos = page.waitForResponse(
      resp => resp.url().includes('/movimientos') && resp.request().method() === 'GET' && resp.status() === 200
    );
    await page.click('button.btn-submit');
    await respuestaMovimientos;
    await page.waitForURL('**/movimientos');

    // 2. Ubicar la fila de "Almuerzo Universidad"
    const fila = page.locator('tr.fila-movimiento', { hasText: 'Almuerzo Universidad' }).first();
    await expect(fila).toBeVisible({ timeout: 5000 });

    // 3. Abrir el modal de edición
    await fila.locator('button.btn-editar').click();
    const modalEditar = page.locator('.modal-card:has(#editar-descripcion)');
    await expect(modalEditar).toBeVisible();

    // Captura 1: Modal de edición abierto
    await page.screenshot({ path: `${EVIDENCIAS}/editar-01-modal-edicion.png`, fullPage: true });

    // 4. Modificar la descripción
    const nuevaDescripcion = 'Almuerzo Universidad Buffet';
    await page.fill('#editar-descripcion', nuevaDescripcion);

    // 5. Guardar cambios y esperar respuesta PUT del backend
    const respuestaPut = page.waitForResponse(
      resp => resp.url().includes('/movimientos/') && resp.request().method() === 'PUT' && resp.status() === 200
    );
    await page.click('button.btn-guardar-principal');
    await respuestaPut;

    // 6. Verificar que el modal se cerró y la tabla muestra la nueva descripción
    await expect(modalEditar).not.toBeVisible();
    await expect(page.locator('tr.fila-movimiento', { hasText: nuevaDescripcion })).toBeVisible();

    // Captura 2: Tabla actualizada con la nueva descripción
    await page.screenshot({ path: `${EVIDENCIAS}/editar-02-descripcion-actualizada.png`, fullPage: true });
    console.log('✅ Descripción de movimiento editada exitosamente');
  });

  test('Flujo Alternativo: En un movimiento pagado el campo de monto está bloqueado (disabled)', async ({ page }) => {
    // 1. Iniciar sesión
    await page.goto('/login');
    await page.fill('input[type="email"]', 'marcos@gmail.com');
    await page.fill('input[type="password"]', '123456');

    const respuestaMovimientos = page.waitForResponse(
      resp => resp.url().includes('/movimientos') && resp.request().method() === 'GET' && resp.status() === 200
    );
    await page.click('button.btn-submit');
    await respuestaMovimientos;
    await page.waitForURL('**/movimientos');

    // 2. Ubicar cualquier fila con estado "Pagado" y abrir su edición
    const filaPagada = page.locator('tr.fila-movimiento:has(.badge-estado-pagado)').first();
    await expect(filaPagada).toBeVisible();
    await filaPagada.locator('button.btn-editar').click();

    // 3. Verificar que el input de cantidad está deshabilitado
    const inputCantidad = page.locator('#editar-cantidad');
    await expect(inputCantidad).toBeDisabled();

    // 4. Verificar que el aviso explicativo de bloqueo está visible
    const avisoBloqueo = page.locator('#motivo-monto-bloqueado');
    await expect(avisoBloqueo).toBeVisible();
    await expect(avisoBloqueo).toContainText('pagado');

    // Captura 3: Input de monto bloqueado con mensaje de regla de negocio
    await page.screenshot({ path: `${EVIDENCIAS}/editar-03-monto-bloqueado.png`, fullPage: true });

    // Cerrar modal
    await page.click('button.btn-cancelar-modal');
    console.log('✅ Bloqueo de monto en movimiento pagado verificado');
  });

  test('Flujo Principal: Eliminar un movimiento con confirmación', async ({ page }) => {
    // 1. Iniciar sesión
    await page.goto('/login');
    await page.fill('input[type="email"]', 'marcos@gmail.com');
    await page.fill('input[type="password"]', '123456');

    const respuestaMovimientos = page.waitForResponse(
      resp => resp.url().includes('/movimientos') && resp.request().method() === 'GET' && resp.status() === 200
    );
    await page.click('button.btn-submit');
    await respuestaMovimientos;
    await page.waitForURL('**/movimientos');

    // 2. Ubicar la última fila (por ejemplo una de las fotocopias de prueba)
    const filaAEliminar = page.locator('tr.fila-movimiento').last();
    await expect(filaAEliminar).toBeVisible();
    const textoFila = (await filaAEliminar.locator('.col-desc-dato').textContent())?.trim() || '';

    // 3. Pulsar botón Eliminar de esa fila
    await filaAEliminar.locator('button.btn-eliminar').click();

    // 4. Verificar que aparece el modal de confirmación
    const modalConfirmar = page.locator('div[role="alertdialog"]');
    await expect(modalConfirmar).toBeVisible();

    // Captura 4: Modal de confirmación para eliminar
    await page.screenshot({ path: `${EVIDENCIAS}/eliminar-01-modal-confirmacion.png`, fullPage: true });

    // 5. Confirmar la eliminación y esperar respuesta DELETE
    const respuestaDelete = page.waitForResponse(
      resp => resp.url().includes('/movimientos/') && resp.request().method() === 'DELETE' && (resp.status() === 200 || resp.status() === 204)
    );
    await page.click('button.btn-confirmar-eliminar');
    await respuestaDelete;

    // 6. Verificar que el modal se cerró
    await expect(modalConfirmar).not.toBeVisible();

    // Captura 5: Tabla tras eliminar el movimiento
    await page.screenshot({ path: `${EVIDENCIAS}/eliminar-02-movimiento-eliminado.png`, fullPage: true });
    console.log(`✅ Movimiento "${textoFila}" eliminado con éxito tras confirmación`);
  });

});

