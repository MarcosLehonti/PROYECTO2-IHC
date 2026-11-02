// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const EVIDENCIAS = path.resolve('docs/evidencias/tarea-6');

test.describe('Pruebas E2E - Buscar y Filtrar Movimientos', () => {

  test('Flujo Principal: Buscar movimientos por descripción en tiempo real', async ({ page }) => {
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

    // 2. Escribir "Beca" en el campo de búsqueda
    const inputBuscar = page.locator('#filtro-q');
    await expect(inputBuscar).toBeVisible();
    await inputBuscar.fill('Beca');

    // 3. Verificar que solo aparece la fila de la Beca y no las de transporte o almuerzo
    const filaBeca = page.locator('tr.fila-movimiento', { hasText: 'Deposito Beca Universitaria' });
    await expect(filaBeca).toBeVisible();

    const filasVisibles = page.locator('tr.fila-movimiento');
    await expect(filasVisibles).toHaveCount(1);

    // Captura 1: Búsqueda activa mostrando solo el resultado coincidente
    await page.screenshot({ path: `${EVIDENCIAS}/filtros-01-busqueda-texto.png`, fullPage: true });

    // 4. Limpiar la búsqueda y verificar que reaparecen todos
    await inputBuscar.clear();
    await expect(page.locator('tr.fila-movimiento')).not.toHaveCount(1);
    console.log('✅ Búsqueda por texto funcionando correctamente');
  });

  test('Flujo Principal: Filtrar movimientos por tipo (solo Gastos)', async ({ page }) => {
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

    // 2. Abrir panel de filtros
    await page.click('button.btn-filtros');
    const panelFiltros = page.locator('#panel-filtros');
    await expect(panelFiltros).toBeVisible();

    // 3. Seleccionar Tipo "gasto" (Gastos)
    await page.selectOption('#filtro-tipo', 'gasto');

    // 4. Verificar que aparece el chip de filtro activo
    const chipFiltro = page.locator('.chip-filtro');
    await expect(chipFiltro).toBeVisible();
    await expect(chipFiltro).toContainText('Gastos');

    // 5. Verificar que ningún movimiento mostrado es un ingreso (+500 Beca)
    const filaIngreso = page.locator('tr.fila-movimiento', { hasText: 'Deposito Beca Universitaria' });
    await expect(filaIngreso).not.toBeVisible();

    // Captura 2: Panel de filtros con filtro de Gastos aplicado
    await page.screenshot({ path: `${EVIDENCIAS}/filtros-02-filtro-gastos.png`, fullPage: true });
    console.log('✅ Filtro por tipo de movimiento funcionando');
  });

  test('Flujo Alternativo: Búsqueda sin coincidencias muestra estado de "Lista vacía"', async ({ page }) => {
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

    // 2. Escribir término inexistente en el buscador
    const inputBuscar = page.locator('#filtro-q');
    await inputBuscar.fill('TextoTotalmenteInexistente999');

    // 3. Verificar que aparece el contenedor de estado vacío
    const estadoVacio = page.locator('.estado-vacio');
    await expect(estadoVacio).toBeVisible({ timeout: 5000 });
    await expect(estadoVacio).toContainText('Ningún movimiento coincide con tu búsqueda');

    // Captura 3: Estado de lista vacía ante búsqueda sin resultados
    await page.screenshot({ path: `${EVIDENCIAS}/filtros-03-lista-vacia.png`, fullPage: true });

    // 4. Restablecer con el botón "Quitar todos los filtros"
    await page.click('button.btn-quitar-filtros');
    await expect(estadoVacio).not.toBeVisible();
    await expect(page.locator('tr.fila-movimiento').first()).toBeVisible();
    console.log('✅ Estado de lista vacía y restauración verificado con éxito');
  });

});

