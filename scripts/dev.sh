#!/bin/bash
# 🛠️ Script de Desenvolvimento Local VeloInsights

echo "🛠️ Iniciando ambiente de desenvolvimento..."

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

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale Node.js 18+"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    warning "Node.js versão $NODE_VERSION detectada. Recomendado: 18+"
fi

# Instalar dependências da API
log "📦 Instalando dependências da API..."
cd api

if [ ! -f "package.json" ]; then
    error "package.json não encontrado na pasta api/"
    exit 1
fi

npm install

if [ $? -eq 0 ]; then
    success "✅ Dependências da API instaladas!"
else
    error "❌ Falha na instalação das dependências da API"
    exit 1
fi

# Instalar dependências do Frontend
log "📦 Instalando dependências do Frontend..."
cd ../frontend

if [ ! -f "package.json" ]; then
    error "package.json não encontrado na pasta frontend/"
    exit 1
fi

npm install

if [ $? -eq 0 ]; then
    success "✅ Dependências do Frontend instaladas!"
else
    error "❌ Falha na instalação das dependências do Frontend"
    exit 1
fi

# Voltar para diretório raiz
cd ..

success "🎉 Ambiente de desenvolvimento configurado!"

echo ""
echo "🚀 Para iniciar o desenvolvimento:"
echo ""
echo "1. Terminal 1 - API:"
echo "   cd api && npm run dev"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "📊 URLs:"
echo "   API: http://localhost:3001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "🔧 Comandos úteis:"
echo "   npm run dev     # Desenvolvimento"
echo "   npm run build   # Build"
echo "   npm run preview # Preview do build"
echo ""
echo "📁 Estrutura:"
echo "   api/           # Backend Node.js"
echo "   frontend/      # Frontend React"
echo "   docs/          # Documentação"
echo "   scripts/       # Scripts de deploy"
echo ""

# Perguntar se quer iniciar automaticamente
read -p "🤔 Quer iniciar os servidores automaticamente? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "🚀 Iniciando servidores..."
    
    # Iniciar API em background
    log "📡 Iniciando API..."
    cd api
    npm run dev &
    API_PID=$!
    
    # Aguardar um pouco
    sleep 3
    
    # Iniciar Frontend em background
    log "🎨 Iniciando Frontend..."
    cd ../frontend
    npm run dev &
    FRONTEND_PID=$!
    
    # Voltar para diretório raiz
    cd ..
    
    success "✅ Servidores iniciados!"
    echo ""
    echo "📊 URLs disponíveis:"
    echo "   API: http://localhost:3001"
    echo "   Frontend: http://localhost:3000"
    echo ""
    echo "🛑 Para parar os servidores:"
    echo "   kill $API_PID $FRONTEND_PID"
    echo ""
    echo "📝 Logs serão exibidos nos terminais respectivos"
    echo ""
    
    # Manter script rodando
    log "⏳ Pressione Ctrl+C para parar os servidores..."
    trap "kill $API_PID $FRONTEND_PID; exit" INT
    
    # Aguardar indefinidamente
    while true; do
        sleep 1
    fi
else
    log "👋 Execute os comandos manualmente quando estiver pronto!"
fi
