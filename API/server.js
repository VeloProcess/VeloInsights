// server.js - API Backend JavaScript puro para Veloinsights - VERSÃO ULTRA SIMPLIFICADA
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// Log de inicialização
console.log('🚀 Iniciando API VeloInsights - Versão Ultra Simplificada...');
console.log('📊 Porta:', PORT);

// CORS SIMPLES E DIRETO
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Endpoint básico para verificar se a API está funcionando
app.get('/api', (req, res) => {
  console.log('🏠 Endpoint /api chamado');
  res.json({ 
    message: 'VeloInsights API - Ultra Simplificada',
    version: '2.0.0-ultra-simple',
    status: 'OK',
    cors: 'enabled',
    timestamp: new Date().toISOString()
  });
});

// Teste simples - VERSÃO ULTRA SIMPLIFICADA
app.get('/api/test', (req, res) => {
  console.log('🧪 Endpoint /api/test chamado');
  res.json({ 
    message: 'API funcionando!',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    status: 'OK',
    version: '2.0.0-ultra-simple'
  });
});

// Buscar dados salvos - VERSÃO ULTRA SIMPLIFICADA
app.get('/api/dados', (req, res) => {
  console.log('📊 Endpoint /api/dados chamado');
  
  const dadosVazios = { 
    tipo: 'ligacoes',
    atendimentos: [], 
    operadores: [],
    acoesOperador: []
  };
  
  console.log('✅ Retornando dados vazios:', dadosVazios);
  res.json(dadosVazios);
});

// Health check
app.get('/api/health', (req, res) => {
  console.log('🏥 Endpoint /api/health chamado');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: 'enabled',
    version: '2.0.0-ultra-simple'
  });
});

// Endpoint de upload simplificado (sem processamento)
app.post('/api/upload', (req, res) => {
  console.log('📁 Endpoint /api/upload chamado');
  console.log('📊 Headers:', req.headers);
  console.log('📊 Body type:', typeof req.body);
  console.log('📊 Body keys:', Object.keys(req.body || {}));
  
  res.json({
    success: true,
    message: 'Upload endpoint funcionando (sem processamento)',
    timestamp: new Date().toISOString(),
    received: {
      headers: req.headers,
      bodyType: typeof req.body,
      bodyKeys: Object.keys(req.body || {})
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API Veloinsights rodando na porta ${PORT}`);
  console.log(`📊 API disponível em: http://localhost:${PORT}/api`);
  console.log(`🧪 Teste em: http://localhost:${PORT}/api/test`);
});

// Exportar para Vercel
module.exports = app;