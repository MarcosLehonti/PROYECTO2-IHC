// tests/helpers/seed-helper.js
// Importable por cualquier spec para garantizar datos limpios en la BD.
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');

const venvPythonWin = path.join(root, 'PRESUPUESTO ESTUDIANTIL', 'BACKEND', 'venv', 'Scripts', 'python.exe');
const venvPythonUnix = path.join(root, 'PRESUPUESTO ESTUDIANTIL', 'BACKEND', 'venv', 'bin', 'python');
const seedScript    = path.join(root, 'PRESUPUESTO ESTUDIANTIL', 'BACKEND', 'seed.py');

let pythonCmd = 'python';
if (fs.existsSync(venvPythonWin)) {
  pythonCmd = venvPythonWin;
} else if (fs.existsSync(venvPythonUnix)) {
  pythonCmd = venvPythonUnix;
}

/** Llama a seed.py y lanza error si falla. */
export function runSeed() {
  const res = spawnSync(pythonCmd, [seedScript], {
    stdio: 'pipe',
    cwd: path.join(root, 'PRESUPUESTO ESTUDIANTIL', 'BACKEND'),
  });
  if (res.status !== 0) {
    const stderr = res.stderr?.toString() || '';
    throw new Error(`runSeed() falló (código ${res.status}): ${stderr}`);
  }
}

