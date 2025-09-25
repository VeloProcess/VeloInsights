@echo off
REM 🚀 Script de Deploy Automático - Velodados (Windows)
REM Este script faz deploy automático sempre que executado

echo 🚀 Iniciando deploy automático do Velodados...

REM 1. Fazer build do projeto
echo 📦 Fazendo build do projeto...
call npm run build

REM 2. Verificar se o build foi bem-sucedido
if %errorlevel% neq 0 (
    echo ❌ Erro no build. Abortando deploy.
    exit /b 1
)

echo ✅ Build realizado com sucesso!

REM 3. Fazer commit das mudanças
echo 📝 Fazendo commit das mudanças...
git add .
git commit -m "Deploy automático: %date% %time%"

REM 4. Fazer push para GitHub
echo 📤 Fazendo push para GitHub...
git push origin main

REM 5. Deploy no Vercel
echo 🌐 Fazendo deploy no Vercel...
vercel deploy --prod

echo 🎉 Deploy automático concluído!
echo 🌐 Acesse: https://veloigp.vercel.app
