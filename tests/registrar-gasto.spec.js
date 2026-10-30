// @ts-check
import { test, expect } from '@playwright/test';

test('Flujo E2E: Iniciar sesión, registrar un gasto y verificar que el total de gastos cambia', async ({ page }) => {
  // 1. Ir a la pantalla de login
  await page.goto('/login');

  // 2. Iniciar sesión con las credenciales
  await page.fill('input[type="email"]', 'marcos@gmail.com');
  await page.fill('input[type="password"]', '123456');

  // Regla de oro de Playwright: preparar la escucha de la API ANTES de hacer clic en enviar
  const respuestaMovimientos = page.waitForResponse(
    resp => resp.url().includes('/movimientos') && resp.request().method() === 'GET' && resp.status() === 200
  );
  await page.click('button.btn-submit');

  // Esperar que la API responda y la URL sea /movimientos
  await respuestaMovimientos;
  await page.waitForURL('**/movimientos');

  // 3. Leer el monto real inicial de "Gastos del Mes"
  const tarjetaGastos = page.locator('.summary-card:has-text("Gastos del Mes") .card-amount');
  await expect(tarjetaGastos).toBeVisible();
  const textoGastoInicial = await tarjetaGastos.textContent();
  const gastoInicial = parseFloat((textoGastoInicial || '0').replace(/[^\d.]/g, '')) || 0;

  console.log(`Gasto del mes inicial real: ${gastoInicial.toFixed(2)} Bs`);

  // 4. Abrir el modal de registro (+ Registrar Movimiento)
  await page.click('button.btn-new-mov');

  // 5. Llenar los datos del nuevo gasto
  const montoRegistrar = 15.0;
  await page.fill('input.input-cantidad', String(montoRegistrar));
  await page.fill('input[placeholder="Almuerzo"]', 'Fotocopias Playwright E2E');

  // 6. Preparar la escucha del guardado (POST) ANTES de hacer clic en Guardar
  const respuestaPost = page.waitForResponse(
    resp => resp.url().includes('/movimientos') && resp.request().method() === 'POST' && (resp.status() === 200 || resp.status() === 201)
  );
  await page.click('button.btn-guardar-principal');
  await respuestaPost;

  // 7. VERIFICACIÓN E2E: El total debe cambiar reflejando el nuevo gasto
  const nuevoGastoEsperado = (gastoInicial + montoRegistrar).toFixed(2);
  console.log(`Gasto del mes esperado: ${nuevoGastoEsperado} Bs`);

  // La tarjeta de Gastos del Mes debe reflejar el nuevo monto sumado
  await expect(tarjetaGastos).toContainText(`${nuevoGastoEsperado} Bs`, { timeout: 10000 });

  // 8. Tomar captura de pantalla como evidencia visual del flujo completado
  await page.screenshot({ path: 'docs/evidencias/evidencia-e2e-gasto-registrado.png', fullPage: true });
  console.log('✅ Evidencia guardada en docs/evidencias/evidencia-e2e-gasto-registrado.png');
});
