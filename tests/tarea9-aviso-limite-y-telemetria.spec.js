// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

// Aumentamos el timeout del test a 90 segundos por los 3 flujos E2E seguidos
test.setTimeout(90000);

const EVIDENCIAS = path.resolve('evidencias/tarea-9');

/** Helper: login y esperar /movimientos */
async function loginYEsperar(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'marcos@gmail.com');
  await page.fill('input[type="password"]', '123456');
  const respMov = page.waitForResponse(
    r => r.url().includes('/movimientos') && r.request().method() === 'GET' && r.status() === 200
  );
  await page.click('button.btn-submit');
  await respMov;
  await page.waitForURL('**/movimientos');
  await page.waitForTimeout(1000);
}

test.describe('Pruebas E2E - Tarea 9: Aviso de Límite por Categoría y Telemetría', () => {

  test('Demostración completa: 1 gasto sin aviso, 1 con aviso cancelado, 1 confirmado (excedido) y panel /analitica', async ({ page }) => {

    // =========================================================================
    // CASO 1: Gasto SIN aviso (20 Bs, dentro del límite de 150 Bs)
    // Situación inicial: gastado=55 Bs, 55+20=75 <= 150 → no hay aviso
    // =========================================================================
    await loginYEsperar(page);

    await page.click('button.btn-new-mov');
    await page.waitForSelector('.dashboard-form', { timeout: 5000 });
    await page.fill('.input-cantidad', '20');
    await page.fill('input[placeholder*="Almuerzo"]', 'Almuerzo corriente');
    await page.selectOption('#categoria-gasto', 'Comida y Almuerzos');

    // Esperar la respuesta POST al guardar
    const respPost1 = page.waitForResponse(
      r => r.url().includes('/movimientos') && r.request().method() === 'POST'
    );
    await page.click('button.btn-guardar-principal');
    await page.waitForTimeout(500);

    // Verificar que NO apareció el modal de aviso
    await expect(page.locator('.modal-aviso-limite')).not.toBeVisible();

    // Esperar que el gasto aparezca en la tabla
    await expect(page.locator('.tarjeta-estudiantil-table')).toContainText('Almuerzo corriente', { timeout: 8000 });

    // Captura 1: Gasto guardado directamente sin aviso
    await page.screenshot({ path: `${EVIDENCIAS}/01-gasto-sin-aviso-guardado.png`, fullPage: false });
    console.log('✅ Caso 1: Gasto de 20 Bs guardado sin aviso');

    // =========================================================================
    // CASO 2: Gasto CON aviso CANCELADO (120 Bs; 75+120=195 > 150, exceso=45 Bs)
    // todo queda igual - no se guarda
    // =========================================================================
    await page.click('button.btn-new-mov');
    await page.waitForSelector('.dashboard-form', { timeout: 5000 });
    await page.fill('.input-cantidad', '120');
    await page.fill('input[placeholder*="Almuerzo"]', 'Cena grupal grande');
    await page.selectOption('#categoria-gasto', 'Comida y Almuerzos');

    await page.click('button.btn-guardar-principal');
    await page.waitForTimeout(600);

    // Verificar que se abrió el modal de aviso de límite
    const modalAviso = page.locator('.modal-aviso-limite');
    await expect(modalAviso).toBeVisible({ timeout: 5000 });
    await expect(modalAviso).toContainText('Aviso: Superarás el límite');

    // Captura 2: Aviso mostrado detallando cuánto se pasaría
    await page.screenshot({ path: `${EVIDENCIAS}/02-aviso-limite-mostrado.png`, fullPage: false });

    // Cancelar - no guarda nada
    await page.click('.btn-cancelar-aviso');
    await page.waitForTimeout(500);
    await expect(modalAviso).not.toBeVisible();

    // Cerrar el formulario de nuevo gasto
    await page.click('.btn-cancelar-modal');
    await page.waitForTimeout(500);

    // Verificar que "Cena grupal grande" NO aparece en la tabla (cancelado)
    await expect(page.locator('.tarjeta-estudiantil-table')).not.toContainText('Cena grupal grande');

    // Captura 3: Todo igual tras cancelar
    await page.screenshot({ path: `${EVIDENCIAS}/03-aviso-cancelado-todo-igual.png`, fullPage: false });
    console.log('✅ Caso 2: Aviso cancelado, gasto NO guardado');

    // =========================================================================
    // CASO 3: Gasto CON aviso CONFIRMADO (120 Bs → queda excedido)
    // =========================================================================
    await page.click('button.btn-new-mov');
    await page.waitForSelector('.dashboard-form', { timeout: 5000 });
    await page.fill('.input-cantidad', '120');
    await page.fill('input[placeholder*="Almuerzo"]', 'Cena grupal grande');
    await page.selectOption('#categoria-gasto', 'Comida y Almuerzos');

    await page.click('button.btn-guardar-principal');
    await page.waitForTimeout(600);

    // Esperar el aviso de nuevo
    await expect(modalAviso).toBeVisible({ timeout: 5000 });
    await expect(modalAviso).toContainText('Aviso: Superarás el límite');

    // Confirmar el exceso
    const respPost3 = page.waitForResponse(
      r => r.url().includes('/movimientos') && r.request().method() === 'POST'
    );
    await page.click('.btn-confirmar-exceso');
    await respPost3;
    await page.waitForTimeout(1500);

    // Verificar que el gasto sí se registró en la tabla
    await expect(page.locator('.tarjeta-estudiantil-table')).toContainText('Cena grupal grande', { timeout: 8000 });

    // Captura 4: Gasto confirmado, registrado
    await page.screenshot({ path: `${EVIDENCIAS}/04-aviso-confirmado-gasto-guardado.png`, fullPage: false });

    // Ver el panel de presupuesto por categoría
    // Primero abrimos el toggle para que mostrarPresupuestosCat=true,
    // luego esperamos que cargue la lista, después forzamos recarga
    const listaCat = page.locator('.cat-presupuestos-lista');
    const estaVisible = await listaCat.isVisible();
    if (!estaVisible) {
      // La lista está oculta: hacemos click para abrirla.
      // Si ya tenía datos en memoria, se muestra sin request; si no, recarga.
      const catPromise = page.waitForResponse(
        r => r.url().includes('/presupuestos-categoria') && r.status() === 200,
        { timeout: 4000 }
      ).catch(() => null);
      await page.click('button.btn-toggle-cat');
      await catPromise;
    } else {
      // La lista ya está visible (mostrarPresupuestosCat=true).
      // Forzamos una recarga haciendo doble click (ocultar → mostrar con nueva request)
      // O mejor: recargamos la página y volvemos a abrir
    }
    await page.waitForTimeout(500);

    // Si el badge no está visible aún, forzamos recarga: navegamos y volvemos
    const filaComida = listaCat.locator('.cat-pres-item').filter({ hasText: 'Comida y Almuerzos' });
    const badgeExcedido = filaComida.locator('.badge-cat-excedido');
    const badgeVisible = await badgeExcedido.isVisible().catch(() => false);

    if (!badgeVisible) {
      // Forzar recarga del estado desde el servidor navegando de nuevo
      const respCatForzada = page.waitForResponse(
        r => r.url().includes('/presupuestos-categoria') && r.status() === 200,
        { timeout: 8000 }
      );
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      // Abrir toggle de categorías
      const catPromise2 = page.waitForResponse(
        r => r.url().includes('/presupuestos-categoria') && r.status() === 200,
        { timeout: 5000 }
      ).catch(() => null);
      await page.click('button.btn-toggle-cat');
      await catPromise2;
      await page.waitForTimeout(500);
    }

    // Verificar que "Comida y Almuerzos" muestra badge Excedido
    const listaCat2 = page.locator('.cat-presupuestos-lista');
    await expect(listaCat2).toBeVisible({ timeout: 5000 });
    const filaComida2 = listaCat2.locator('.cat-pres-item').filter({ hasText: 'Comida y Almuerzos' });
    await expect(filaComida2).toBeVisible({ timeout: 5000 });
    // El estado excedido se muestra con el badge rojo
    await expect(filaComida2.locator('.badge-cat-excedido')).toBeVisible({ timeout: 8000 });

    // Captura 5: Categoría en estado Excedido tras confirmación
    await page.screenshot({ path: `${EVIDENCIAS}/05-categoria-excedida-confirmada.png`, fullPage: false });
    console.log('✅ Caso 3: Aviso confirmado, categoría en estado Excedido');

    // =========================================================================
    // CASO 4: Panel de Embudos en /analitica
    // =========================================================================
    await page.goto('/analitica');
    await page.waitForSelector('.analitica-contenedor', { timeout: 8000 });
    await page.waitForTimeout(800);

    // Verificar que los embudos y KPIs están presentes
    await expect(page.locator('.analitica-titulo')).toContainText('Embudos de Conversión');
    const embudos = page.locator('.card-embudo');
    await expect(embudos).toHaveCount(3);

    // Captura 6: Panel de Embudos con caídas y conversiones
    await page.screenshot({ path: `${EVIDENCIAS}/06-panel-analitica-embudos.png`, fullPage: false });

    // Verificar sección de frenos y tabla cronológica
    await expect(page.locator('.seccion-frenos')).toBeVisible();
    await expect(page.locator('.tabla-telemetria')).toBeVisible();

    // Captura 7: Frenos y registro de eventos
    await page.screenshot({ path: `${EVIDENCIAS}/07-panel-analitica-frenos-y-eventos.png`, fullPage: false });
    console.log('✅ Caso 4: Panel /analitica con embudos visible y correcto');
  });

});
