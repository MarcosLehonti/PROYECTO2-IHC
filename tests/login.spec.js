// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const EVIDENCIAS = path.resolve('docs/evidencias/tarea-6');

test.describe('Pruebas E2E - Autenticación (Login y Logout)', () => {

  test('Flujo Principal: Iniciar sesión exitosamente y cerrar sesión', async ({ page }) => {
    // 1. Ir a la página de login
    await page.goto('/login');
    await page.screenshot({ path: `${EVIDENCIAS}/login-00-pantalla-login.png`, fullPage: true });

    // 2. Ingresar credenciales correctas
    await page.fill('input[type="email"]', 'marcos@gmail.com');
    await page.fill('input[placeholder="•••••••••"]', '123456');

    // 3. Hacer clic en "Iniciar Sesión" y esperar la redirección
    await Promise.all([
      page.waitForURL('**/movimientos'),
      page.click('button.btn-submit')
    ]);

    // 4. Verificar que estamos en la pantalla principal y que saluda al usuario
    await expect(page).toHaveURL(/.*movimientos/);
    const saludo = page.locator('.greeting-text');
    await expect(saludo).toContainText('Marcos');

    // Captura: sesión iniciada correctamente
    await page.screenshot({ path: `${EVIDENCIAS}/login-01-sesion-exitosa.png`, fullPage: true });

    // 5. Cerrar sesión (Logout)
    const botonLogout = page.locator('button.btn-logout');
    await expect(botonLogout).toBeVisible();
    await Promise.all([
      page.waitForURL('**/login'),
      botonLogout.click()
    ]);

    // 6. Verificar que regresó a la pantalla de login
    await expect(page).toHaveURL(/.*login/);

    // Captura: logout exitoso, de vuelta en login
    await page.screenshot({ path: `${EVIDENCIAS}/login-02-logout.png`, fullPage: true });
    console.log('✅ Login y Logout exitosos');
  });

  test('Flujo Alternativo: Mostrar mensaje de error al ingresar contraseña incorrecta', async ({ page }) => {
    // 1. Ir a la página de login
    await page.goto('/login');

    // 2. Ingresar correo correcto pero contraseña incorrecta
    await page.fill('input[type="email"]', 'marcos@gmail.com');
    await page.fill('input[placeholder="•••••••••"]', 'clave_equivocada_999');

    // 3. Intentar iniciar sesión
    await page.click('button.btn-submit');

    // 4. Verificar que aparece el mensaje de error de credenciales
    const alertaError = page.locator('.error-alert');
    await expect(alertaError).toBeVisible({ timeout: 5000 });
    await expect(alertaError).toContainText(/incorrect|inválid|error/i);

    // Captura: error de credenciales visible
    await page.screenshot({ path: `${EVIDENCIAS}/login-03-error-credenciales.png`, fullPage: true });

    // 5. Verificar que NO redirigió, se quedó en /login
    await expect(page).toHaveURL(/.*login/);
    console.log('✅ Validación de contraseña incorrecta funcionando');
  });

});

