@echo off
set BACKEND_PORT=8000
set FRONTEND_PORT=5173

echo [0/4] Liberando portas %BACKEND_PORT% e %FRONTEND_PORT%...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%BACKEND_PORT% ^| findstr LISTENING') do taskkill /F /PID %%a 2>NUL
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%FRONTEND_PORT% ^| findstr LISTENING') do taskkill /F /PID %%a 2>NUL

echo [1/4] Iniciando Servidor Backend (FastAPI / LangGraph)...
cd apps\backend
start /B uvicorn main:app --host 0.0.0.0 --port %BACKEND_PORT%
cd ..\..

echo [2/4] Iniciando Interface React (Vite)...
cd apps\frontend
start /B npm run dev -- --port %FRONTEND_PORT% --strictPort
cd ..\..

echo [3/4] Aguardando inicializacao dos servidores...
timeout /t 8 /nobreak > NUL

echo [4/4] Abrindo NeuroStrategy OS no Chromium (Modo App)...
start chrome --app=http://localhost:%FRONTEND_PORT%

echo.
echo Operacao concluida. Navegador Autonomo pronto para uso!
echo =======================================================
echo (As mensagens dos servidores irao aparecer aqui mesmo).
echo (Aperte CTRL+C para derrubar todo o sistema quando terminar).
pause
