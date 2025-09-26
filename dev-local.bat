@echo off
echo ========================================
echo   VELOINSIGHTS - DESENVOLVIMENTO LOCAL
echo ========================================
echo.

echo Iniciando API (Backend) na porta 3001...
start "API Backend" cmd /k "cd API && npm run dev"

echo Aguardando 3 segundos...
timeout /t 3 /nobreak > nul

echo Iniciando Frontend (Publico) na porta 3000...
start "Frontend Publico" cmd /k "cd PUBLIC && npm run dev"

echo.
echo ========================================
echo   DESENVOLVIMENTO INICIADO!
echo ========================================
echo.
echo 📊 API: http://localhost:3001
echo 🌐 Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar...
pause > nul
