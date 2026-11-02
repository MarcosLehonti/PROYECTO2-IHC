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

test.describe('Pruebas E2E - Presupuesto por Categoría', () => {

  test('Flujo Principal: Expandir panel de categorías y verificar presupuesto de Comida y Almuerzos', async ({ page }) => {
    // 1. Login
    await loginYEsperar(page);

    // 2. El panel de categorías está colapsado por defecto — verificar botón visible
    const btnToggle = page.locator('button.btn-toggle-cat');
    await expect(btnToggle).toBeVisible({ timeout: 5000 });
    await expect(btnToggle).toContainText('Ver presupuesto por categoría');

    // Captura 1: panel colapsado
    await page.screenshot({ path: `${EVIDENCIAS}/cat-01-panel-colapsado.png`, fullPage: true });

    // 3. Expandir el panel
    const respCat = page.waitForResponse(
      r => r.url().includes('/presupuestos-categoria') && r.status() === 200
    );
    await btnToggle.click();
    await respCat;

    // 4. El panel de categorías ahora es visible
    const listaCat = page.locator('.cat-presupuestos-lista');
    await expect(listaCat).toBeVisible({ timeout: 5000 });

    // 5. Verificar que aparece "Comida y Almuerzos" con su límite de 150 Bs (cargado por la semilla)
    const filaComiday = listaCat.locator('.cat-pres-item').filter({ hasText: 'Comida y Almuerzos' });
    await expect(filaComiday).toBeVisible({ timeout: 5000 });
    await expect(filaComiday).toContainText('150');   // límite 150 Bs
    await expect(filaComiday).toContainText('Gastado');

    // Captura 2: panel expandido con presupuesto de Comida visible
    await page.screenshot({ path: `${EVIDENCIAS}/cat-02-panel-expandido.png`, fullPage: true });

    console.log('✅ Panel de categorías expandido y presupuesto de Comida y Almuerzos visible');
  });

  test('Flujo Alternativo: Asignar presupuesto a "Transporte y Pasajes" via prompt y verificar que aparece', async ({ page }) => {
    // 1. Login
    await loginYEsperar(page);

    // 2. Expandir el panel de categorías
    const btnToggle = page.locator('button.btn-toggle-cat');
    const respCat = page.waitForResponse(
      r => r.url().includes('/presupuestos-categoria') && r.status() === 200
    );
    await btnToggle.click();
    await respCat;

    const listaCat = page.locator('.cat-presupuestos-lista');
    await expect(listaCat).toBeVisible({ timeout: 5000 });

    // 3. Buscar la fila de "Transporte y Pasajes" (sin límite asignado por semilla)
    const filaTransporte = listaCat.locator('.cat-pres-item').filter({ hasText: 'Transporte y Pasajes' });
    await expect(filaTransporte).toBeVisible({ timeout: 5000 });

    // El botón debe decir "Asignar" (sin límite previo)
    const btnAsignar = filaTransporte.locator('button.btn-asignar-cat');
    await expect(btnAsignar).toContainText(/Asignar|Editar/);

    // Captura 3: botón "Asignar" visible antes de hacer clic
    await page.screenshot({ path: `${EVIDENCIAS}/cat-03-antes-asignar.png`, fullPage: true });

    // 4. Interceptar el prompt() nativo ANTES de hacer clic
    page.once('dialog', async dialog => {
      // El prompt pregunta el monto — respondemos 80
      await dialog.accept('80');
    });

    // 5. Escuchar la petición POST /presupuestos-categoria
    const respPost = page.waitForResponse(
      r => r.url().includes('/presupuestos-categoria') && r.request().method() === 'POST' && r.status() === 200
    );

    await btnAsignar.click();
    await respPost;

    // 6. Esperar que la lista se recargue con el nuevo límite
    await page.waitForResponse(
      r => r.url().includes('/presupuestos-categoria') && r.status() === 200
    );

    // 7. Verificar que "Transporte y Pasajes" ahora muestra el límite de 80 Bs
    await expect(filaTransporte).toContainText('80', { timeout: 5000 });

    // Captura 4: límite asignado visible en la lista
    await page.screenshot({ path: `${EVIDENCIAS}/cat-04-limite-asignado.png`, fullPage: true });

    console.log('✅ Presupuesto de Transporte y Pasajes asignado a 80 Bs via prompt()');
  });

});

