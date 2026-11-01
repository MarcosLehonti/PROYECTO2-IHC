import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const venvPythonWin = path.join(process.cwd(), 'PRESUPUESTO ESTUDIANTIL', 'BACKEND', 'venv', 'Scripts', 'python.exe');
const venvPythonUnix = path.join(process.cwd(), 'PRESUPUESTO ESTUDIANTIL', 'BACKEND', 'venv', 'bin', 'python');
const seedScript = path.join(process.cwd(), 'PRESUPUESTO ESTUDIANTIL', 'BACKEND', 'seed.py');

let pythonCmd = 'python';
if (fs.existsSync(venvPythonWin)) {
  pythonCmd = venvPythonWin;
} else if (fs.existsSync(venvPythonUnix)) {
  pythonCmd = venvPythonUnix;
}

const res = spawnSync(pythonCmd, [seedScript], { stdio: 'inherit', cwd: path.join(process.cwd(), 'PRESUPUESTO ESTUDIANTIL', 'BACKEND') });
process.exit(res.status || 0);

