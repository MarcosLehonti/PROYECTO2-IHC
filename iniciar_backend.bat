@echo off
title Backend - Presupuesto Estudiantil
echo ===================================================
echo Iniciando Backend FastAPI...
echo ===================================================
cd /d "%~dp0PRESUPUESTO ESTUDIANTIL\BACKEND"
call venv\Scripts\activate.bat
python -m uvicorn main:app --reload --port 8000
pause
