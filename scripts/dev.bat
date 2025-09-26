@echo off
REM 🛠️ Script de Desenvolvimento Local VeloInsights (Windows)

echo 🛠️ Iniciando ambiente de desenvolvimento...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale Node.js 18+
    pause
    exit /b 1
)

REM Instalar dependências da API
echo 📦 Instalando dependências da API...
cd api

if not exist "package.json" (
    echo ❌ package.json não encontrado na pasta api/
    pause
    exit /b 1
)

call npm install

if %errorlevel% neq 0 (
    echo ❌ Falha na instalação das dependências da API
    pause
    exit /b 1
)

echo ✅ Dependências da API instaladas!

REM Instalar dependências do Frontend
echo 📦 Instalando dependências do Frontend...
cd ..\frontend

if not exist "package.json" (
    echo ❌ package.json não encontrado na pasta frontend/
    pause
    exit /b 1
)

call npm install

if %errorlevel% neq 0 (
    echo ❌ Falha na instalação das dependências do Frontend
    pause
    exit /b 1
)

echo ✅ Dependências do Frontend instaladas!

REM Voltar para diretório raiz
cd ..

echo 🎉 Ambiente de desenvolvimento configurado!
echo.
echo 🚀 Para iniciar o desenvolvimento:
echo.
echo 1. Terminal 1 - API:
echo    cd api ^&^& npm run dev
echo.
echo 2. Terminal 2 - Frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 📊 URLs:
echo    API: http://localhost:3001
echo    Frontend: http://localhost:3000
echo.
echo 🔧 Comandos úteis:
echo    npm run dev     # Desenvolvimento
echo    npm run build   # Build
echo    npm run preview # Preview do build
echo.
echo 📁 Estrutura:
echo    api/           # Backend Node.js
echo    frontend/      # Frontend React
echo    docs/          # Documentação
echo    scripts/       # Scripts de deploy
echo.

REM Perguntar se quer iniciar automaticamente
set /p choice="🤔 Quer iniciar os servidores automaticamente? (y/n): "
if /i "%choice%"=="y" (
    echo 🚀 Iniciando servidores...
    
    REM Iniciar API em nova janela
    echo 📡 Iniciando API...
    start "API VeloInsights" cmd /k "cd api && npm run dev"
    
    REM Aguardar um pouco
    timeout /t 3 /nobreak >nul
    
    REM Iniciar Frontend em nova janela
    echo 🎨 Iniciando Frontend...
    start "Frontend VeloInsights" cmd /k "cd frontend && npm run dev"
    
    echo ✅ Servidores iniciados!
    echo.
    echo 📊 URLs disponíveis:
    echo    API: http://localhost:3001
    echo    Frontend: http://localhost:3000
    echo.
    echo 🛑 Para parar os servidores, feche as janelas do terminal
    echo.
    echo 📝 Logs serão exibidos nas janelas respectivas
    echo.
) else (
    echo 👋 Execute os comandos manualmente quando estiver pronto!
)

pause
