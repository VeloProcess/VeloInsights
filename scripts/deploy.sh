#!/bin/bash
# 🚀 Script de Deploy VeloInsights

echo "🚀 Iniciando deploy do VeloInsights..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    error "Vercel CLI não encontrado. Instale com: npm i -g vercel"
    exit 1
fi

# Deploy da API
log "📡 Deployando API..."
cd api

if [ ! -f "package.json" ]; then
    error "package.json não encontrado na pasta api/"
    exit 1
fi

# Instalar dependências
log "📦 Instalando dependências da API..."
npm install

# Deploy para Vercel
log "🚀 Fazendo deploy da API para Vercel..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    success "✅ API deployada com sucesso!"
else
    error "❌ Falha no deploy da API"
    exit 1
fi

# Deploy do Frontend
log "🎨 Deployando Frontend..."
cd ../frontend

if [ ! -f "package.json" ]; then
    error "package.json não encontrado na pasta frontend/"
    exit 1
fi

# Instalar dependências
log "📦 Instalando dependências do Frontend..."
npm install

# Build do frontend
log "🔨 Fazendo build do Frontend..."
npm run build

if [ $? -eq 0 ]; then
    success "✅ Build do Frontend concluído!"
else
    error "❌ Falha no build do Frontend"
    exit 1
fi

# Deploy para Vercel
log "🚀 Fazendo deploy do Frontend para Vercel..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    success "✅ Frontend deployado com sucesso!"
else
    error "❌ Falha no deploy do Frontend"
    exit 1
fi

# Voltar para diretório raiz
cd ..

success "🎉 Deploy completo do VeloInsights!"
log "📊 Verifique os projetos na Vercel Dashboard"
log "🔗 URLs serão exibidas após o deploy"

echo ""
echo "📋 Próximos passos:"
echo "1. Verificar se ambos os projetos estão funcionando"
echo "2. Testar upload de planilha"
echo "3. Verificar CORS entre API e Frontend"
echo "4. Configurar domínios customizados (opcional)"
echo ""
echo "🔧 Comandos úteis:"
echo "- vercel logs [project-name]  # Ver logs"
echo "- vercel env add [key] [value] # Adicionar variáveis"
echo "- vercel domains add [domain]  # Adicionar domínio"
echo ""
