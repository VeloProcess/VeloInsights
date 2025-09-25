#!/bin/bash

# 🚀 Script de Deploy Automático - Velodados
# Este script faz deploy automático sempre que executado

echo "🚀 Iniciando deploy automático do Velodados..."

# 1. Fazer build do projeto
echo "📦 Fazendo build do projeto..."
npm run build

# 2. Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build realizado com sucesso!"
else
    echo "❌ Erro no build. Abortando deploy."
    exit 1
fi

# 3. Fazer commit das mudanças
echo "📝 Fazendo commit das mudanças..."
git add .
git commit -m "Deploy automático: $(date '+%Y-%m-%d %H:%M:%S')"

# 4. Fazer push para GitHub
echo "📤 Fazendo push para GitHub..."
git push origin main

# 5. Deploy no Vercel
echo "🌐 Fazendo deploy no Vercel..."
vercel deploy --prod

echo "🎉 Deploy automático concluído!"
echo "🌐 Acesse: https://veloigp.vercel.app"
