// @ts-check
// tests/clase22-dark-pattern-fix.spec.js
//
// Verifica que el modal de aviso de límite de categoría
// NO contiene lenguaje de confirmshaming (patrón oscuro).
//
// FALLA con el código anterior (texto culpabilizador).
// PASA con el fix (texto neutro, Nielsen 3).

import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test.describe('FIX(ETICA) - Clase 22: Eliminación de Confirmshaming en modal de límite', () => {

  test('El modal de aviso de límite usa lenguaje neutro, no culpabilizador (Nielsen 3)', async ({ page }) => {
    // ----- Login -----
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

    // ----- Abrir formulario de nuevo gasto -----
    await page.click('button.btn-new-mov');
    await page.waitForSelector('.dashboard-form', { timeout: 5000 });

    // Rellenar con un gasto que supera el límite de "Comida y Almuerzos" (límite 150 Bs)
    // El seed tiene 55 Bs gastados; 55 + 120 = 175 > 150 → debe aparecer el aviso
    await page.fill('.input-cantidad', '120');
    await page.fill('input[placeholder*="Almuerzo"]', 'Test dark pattern');
    await page.selectOption('#categoria-gasto', 'Comida y Almuerzos');

    await page.click('button.btn-guardar-principal');
    await page.waitForTimeout(600);

    // ----- El modal debe estar visible -----
    const modal = page.locator('.modal-aviso-limite');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Captura del DESPUÉS: modal ético, sin confirmshaming
    await page.screenshot({ path: 'evidencias/clase-22/despues-etica-limite.png', fullPage: false });

    // =========================================================
    // VERIFICACIONES DEL FIX (texto neutro — Nielsen 3)
    // =========================================================

    // ✅ El título NO debe contener lenguaje alarmante/culpabilizador
    const titulo = modal.locator('h2');
    await expect(titulo).not.toContainText('Superarás el límite');
    await expect(titulo).not.toContainText('⚠️');

    // ✅ La descripción NO debe acusar al usuario
    await expect(modal).not.toContainText('Este gasto hará que superes');
    await expect(modal).not.toContainText('hará que superes');

    // ✅ El botón de acción principal NO debe contener "exceder" (confirmshaming)
    const btnConfirmar = modal.locator('.btn-confirmar-exceso');
    await expect(btnConfirmar).not.toContainText('exceder');
    await expect(btnConfirmar).not.toContainText('Sí, confirmar y exceder');

    // ✅ El botón de cancelar NO debe tener paréntesis que añadan peso psicológico
    const btnCancelar = modal.locator('.btn-cancelar-aviso');
    await expect(btnCancelar).not.toContainText('(No guardar)');

    // =========================================================
    // VERIFICACIONES POSITIVAS: el texto correcto está presente
    // =========================================================

    // ✅ Título informativo y neutro
    await expect(titulo).toContainText('Este gasto supera el presupuesto de la categoría');

    // ✅ Descripción explica sin culpar: menciona que puede guardar o cancelar
    await expect(modal).toContainText('Puedes guardarlo igual o cancelar sin cambios');

    // ✅ Botón de confirmar dice qué hace, sin drama
    await expect(btnConfirmar).toContainText('Guardar de todos modos');

    // ✅ Botón cancelar es simple y simétrico
    await expect(btnCancelar).toContainText('Cancelar');

    // ✅ La pregunta de confirmación es neutral
    await expect(modal).toContainText('¿Qué deseas hacer?');

    // ----- Cancelar sin guardar para limpiar el estado -----
    await page.click('.btn-cancelar-aviso');
    await page.waitForTimeout(300);
    await expect(modal).not.toBeVisible();
  });

});

