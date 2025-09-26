// server.js - API Backend JavaScript puro para Veloinsights - VERSÃO ULTRA SIMPLIFICADA
const express = require('express');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Log de inicialização
console.log('🚀 Iniciando API VeloInsights - Versão Ultra Simplificada...');
console.log('📊 Porta:', PORT);

// CORS ESPECÍFICO PARA VELOINSIGHTS
app.use((req, res, next) => {
  console.log('🌐 CORS middleware executado para:', req.method, req.path);
  console.log('🌐 Origin:', req.headers.origin);
  
  // Permitir apenas o frontend específico
  const allowedOrigins = [
    'https://veloinsights-app.vercel.app',
    'https://veloinsights-public.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', 'https://veloinsights-app.vercel.app');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request - enviando 200');
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Configuração do Multer para upload
const storage = multer.memoryStorage(); // Usar memória em vez de disco
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100MB limite (aumentado)
    files: 1 // apenas 1 arquivo por vez
    
  },
  fileFilter: (req, file, cb) => {
    console.log('📊 Arquivo recebido:', file.originalname);
    console.log('📊 MIME Type:', file.mimetype);
    console.log('📊 Fieldname:', file.fieldname);
    
    // Validar tipos de arquivo permitidos (mais flexível)
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/octet-stream', // Fallback para .xlsx
      'application/x-zip-compressed' // Outro tipo comum para .xlsx
    ];
    
    // Verificar também pela extensão
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      console.log('✅ Arquivo aceito:', file.originalname);
      cb(null, true);
    } else {
      console.log('❌ Arquivo rejeitado:', file.originalname, 'MIME:', file.mimetype);
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

// Middleware de tratamento de erro do Multer
app.use((error, req, res, next) => {
  console.log('❌ Erro no upload:', error.message);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'Arquivo muito grande',
        message: 'O arquivo deve ter no máximo 100MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Muitos arquivos',
        message: 'Envie apenas um arquivo por vez'
      });
    }
  }
  
  res.status(400).json({
    success: false,
    error: error.message,
    message: 'Erro no upload do arquivo'
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