// global-setup.js
// Ejecutado automáticamente por Playwright antes de cualquier test.
// Siembra la base de datos con datos limpios y predecibles.
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const venvPythonWin = path.join(__dirname, 'PRESUPUESTO ESTUDIANTIL', 'BACKEND', 'venv', 'Scripts', 'python.exe');
const venvPythonUnix = path.join(__dirname, 'PRESUPUESTO ESTUDIANTIL', 'BACKEND', 'venv', 'bin', 'python');
const seedScript  = path.join(__dirname, 'PRESUPUESTO ESTUDIANTIL', 'BACKEND', 'seed.py');

let pythonCmd = 'python';
if (fs.existsSync(venvPythonWin)) {
  pythonCmd = venvPythonWin;
} else if (fs.existsSync(venvPythonUnix)) {
  pythonCmd = venvPythonUnix;
}

export default async function globalSetup() {
  console.log('\n[global-setup] Sembrando base de datos con datos limpios…');
  const res = spawnSync(pythonCmd, [seedScript], {
    stdio: 'inherit',
    cwd: path.join(__dirname, 'PRESUPUESTO ESTUDIANTIL', 'BACKEND'),
  });
  if (res.status !== 0) {
    throw new Error(`[global-setup] seed.py falló con código ${res.status}`);
  }
  console.log('[global-setup] Semilla aplicada correctamente.\n');
}

