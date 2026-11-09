// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const EVIDENCIAS = path.resolve('docs/evidencias/tarea-8');

test.describe('Pruebas E2E - Tarea 8: Metas de Ahorro con Fondos Disponibles', () => {

  test('Flujo completo de Metas de Ahorro: 2 creadas, 1 asignacion, 1 transferencia, 1 retiro y 1 intento fallido sin fondos', async ({ page }) => {
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

    // 2. Navegar a la pestaña "🎯 Metas de ahorro"
    const tabMetas = page.locator('#tab-metas');
    await expect(tabMetas).toBeVisible();
    await tabMetas.click();
    await page.waitForTimeout(500);

    // Captura 1: Sección de metas de ahorro activa
    await page.screenshot({ path: `${EVIDENCIAS}/01-seccion-metas-inicial.png`, fullPage: false });

    // 3. Crear primera meta: "Laptop para la U" (Objetivo: 2000 Bs)
    await page.click('.btn-nueva-meta');
    await page.fill('input[placeholder*="Laptop"]', 'Laptop para la U');
    await page.fill('input[placeholder="0.00"]', '2000');
    await page.fill('input[type="date"]', '2026-12-31');
    await page.click('button:has-text("Crear Meta")');
    await page.waitForTimeout(800);

    // 4. Crear segunda meta: "Fondo de Emergencia" (Objetivo: 500 Bs)
    await page.click('.btn-nueva-meta');
    await page.fill('input[placeholder*="Laptop"]', 'Fondo de Emergencia');
    await page.fill('input[placeholder="0.00"]', '500');
    await page.fill('input[type="date"]', '2026-11-30');
    await page.click('button:has-text("Crear Meta")');
    await page.waitForTimeout(800);

    // Verificar que existen las 2 metas
    const cards = page.locator('.card-meta');
    await expect(cards).toHaveCount(2);

    // Captura 2: Dos metas de ahorro creadas
    await page.screenshot({ path: `${EVIDENCIAS}/02-dos-metas-creadas.png`, fullPage: false });

    // 5. Asignar 100 Bs a la primera meta ("Laptop para la U")
    const cardLaptop = cards.filter({ hasText: 'Laptop para la U' });
    await cardLaptop.locator('.btn-asignar').click();
    await page.waitForTimeout(300);
    await page.fill('.modal-card input[placeholder="0.00"]', '100');
    await page.click('button:has-text("Asignar fondos")');
    await page.waitForTimeout(800);

    // Verificar que se refleja el monto ahorrado en la meta y en el banner
    await expect(cardLaptop.locator('.meta-monto-ahorrado')).toContainText('100.00 Bs');

    // Captura 3: Fondos asignados a la primera meta
    await page.screenshot({ path: `${EVIDENCIAS}/03-fondos-asignados.png`, fullPage: false });

    // 6. Transferir 40 Bs de "Laptop para la U" a "Fondo de Emergencia"
    await cardLaptop.locator('.btn-transferir').click();
    await page.waitForTimeout(300);
    await page.locator('.modal-card select').selectOption({ index: 1 });
    await page.fill('.modal-card input[placeholder="0.00"]', '40');
    await page.click('button:has-text("Confirmar transferencia")');
    await page.waitForTimeout(800);

    // Verificar nuevos saldos en ambas metas
    const cardFondo = cards.filter({ hasText: 'Fondo de Emergencia' });
    await expect(cardLaptop.locator('.meta-monto-ahorrado')).toContainText('60.00 Bs');
    await expect(cardFondo.locator('.meta-monto-ahorrado')).toContainText('40.00 Bs');

    // Captura 4: Transferencia entre metas completada
    await page.screenshot({ path: `${EVIDENCIAS}/04-transferencia-entre-metas.png`, fullPage: false });

    // 7. Retirar 20 Bs de "Fondo de Emergencia" al disponible
    await cardFondo.locator('.btn-retirar').click();
    await page.waitForTimeout(300);
    await page.fill('.modal-card input[placeholder="0.00"]', '20');
    await page.click('button:has-text("Retirar al disponible")');
    await page.waitForTimeout(800);

    // Verificar que se redujo a 20 Bs
    await expect(cardFondo.locator('.meta-monto-ahorrado')).toContainText('20.00 Bs');

    // Captura 5: Retiro de fondos de una meta
    await page.screenshot({ path: `${EVIDENCIAS}/05-retiro-fondos-meta.png`, fullPage: false });

    // 8. Intento fallido sin fondos: intentar asignar 10,000 Bs (mayor al disponible)
    await cardLaptop.locator('.btn-asignar').click();
    await page.waitForTimeout(300);
    await page.fill('.modal-card input[placeholder="0.00"]', '10000');
    await page.click('button:has-text("Asignar fondos")');
    await page.waitForTimeout(600);

    // Verificar que aparece el mensaje de error de fondos insuficientes
    const errorMsg = page.locator('.modal-card .form-error-custom');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText(/Fondos insuficientes/i);

    // Captura 6: Intento fallido sin fondos (Rechazo con feedback claro)
    await page.screenshot({ path: `${EVIDENCIAS}/06-intento-fallido-sin-fondos.png`, fullPage: false });

    // Cerrar modal
    await page.click('.modal-card .btn-cancelar-modal');
  });

});
