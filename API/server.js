// server.js - API Backend JavaScript puro para Veloinsights - VERSÃO ULTRA SIMPLIFICADA
const express = require('express');
const multer = require('multer');

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

// Configuração do Multer para upload
const storage = multer.memoryStorage(); // Usar memória em vez de disco
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB limite
    files: 1 // apenas 1 arquivo por vez
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de arquivo permitidos
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use .xlsx, .xls ou .csv'), false);
    }
  }
});

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

// Endpoint de upload com Multer
app.post('/api/upload', upload.single('planilha'), (req, res) => {
  console.log('📁 Endpoint /api/upload chamado');
  console.log('📊 Headers:', req.headers);
  console.log('📊 File:', req.file ? 'Arquivo recebido' : 'Nenhum arquivo');
  
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Nenhum arquivo enviado',
      message: 'Por favor, selecione um arquivo .xlsx, .xls ou .csv'
    });
  }
  
  const fileSizeMB = (req.file.size / 1024 / 1024).toFixed(2);
  console.log('📊 Arquivo recebido:', req.file.originalname, 'Tamanho:', fileSizeMB + 'MB');
  
  res.json({
    success: true,
    message: 'Arquivo recebido com sucesso!',
    timestamp: new Date().toISOString(),
    file: {
      name: req.file.originalname,
      size: fileSizeMB + 'MB',
      type: req.file.mimetype
    },
    note: 'Processamento de planilha será implementado em breve'
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