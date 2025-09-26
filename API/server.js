// server.js - API Backend JavaScript puro para Veloinsights
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configurado PRIMEIRO (antes de outros middlewares)
app.use(cors({
  origin: true, // Permitir todas as origens temporariamente
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Middleware de segurança (após CORS)
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
});
app.use('/api/', limiter);

// Middleware adicional para garantir CORS
app.use((req, res, next) => {
  // Permitir todas as origens temporariamente
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '50mb' })); // Reduzido para 50MB (Vercel free tier)
app.use(express.static('public'));

// Configuração do Multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB limite (Vercel free tier)
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

// Criar pasta uploads se não existir
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Funções de processamento (copiadas do frontend)
const hmsToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  if (parts.length !== 3) return 0;
  const [hours, minutes, seconds] = parts.map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
};

const parseDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}T${timeStr}`);
};

const processarPlanilha = (filePath) => {
  try {
    // Validação de segurança: verificar se o arquivo existe e é válido
    if (!fs.existsSync(filePath)) {
      throw new Error('Arquivo não encontrado');
    }
    
    const stats = fs.statSync(filePath);
    if (stats.size > 100 * 1024 * 1024) { // Limite de 100MB
      throw new Error('Arquivo muito grande (máximo 100MB)');
    }
    
    // Configuração otimizada para arquivos grandes
    const workbook = XLSX.readFile(filePath, {
      cellDates: true,
      cellNF: false,
      cellText: false,
      raw: false,
      dense: false,
      sheetRows: 0, // Processar todas as linhas
      bookDeps: false // Não carregar dependências desnecessárias
    });
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Planilha não contém abas válidas');
    }
    
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    if (!sheet) {
      throw new Error('Primeira aba da planilha não é válida');
    }
    
    // Processar em chunks para arquivos grandes
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: '',
      blankrows: false,
      range: 0 // Processar todas as linhas
    });

    // Converter para formato de objeto com headers
    const headers = jsonData[0];
    const rows = jsonData.slice(1);
    
    // Detectar tipo de módulo baseado nos headers
    const isModuloLigacoes = headers.includes('Chamada') && headers.includes('Operador');
    const isModuloOperador = headers.includes('Duração') && headers.includes('Motivo da Pauda');
    
    const atendimentos = [];
    const operadores = new Set();
    const acoesOperador = [];

    // Processar em lotes para arquivos grandes
    const batchSize = 1000; // Processar 1000 linhas por vez
    const totalRows = rows.length;
    
    console.log(`📊 Processando ${totalRows} linhas em lotes de ${batchSize}...`);

    for (let i = 0; i < totalRows; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      
      batch.forEach(row => {
      // Criar objeto com headers como chaves
      const rowObj = {};
      headers.forEach((header, index) => {
        rowObj[header] = row[index] || '';
      });
      
      // Processar Módulo "Detalhes de Ligações"
      if (isModuloLigacoes && rowObj['Chamada'] === 'Atendida' && rowObj['Operador'] && 
          typeof rowObj['Operador'] === 'string' && rowObj['Operador'].trim()) {
        
        // Sanitizar dados de entrada
        const operador = rowObj['Operador'].trim().substring(0, 100);
        const dataAtendimento = rowObj['Data Atendimento'] ? rowObj['Data Atendimento'].toString() : '';
        const horaAtendimento = rowObj['Hora Atendimento'] ? rowObj['Hora Atendimento'].toString() : '';
        
        atendimentos.push({
          operador: operador,
          data: rowObj['Data'] || '',
          data_atendimento: parseDateTime(dataAtendimento, horaAtendimento),
          tempo_falado: rowObj['Tempo Falado'] || '',
          duracao_segundos: hmsToSeconds(rowObj['Tempo Falado']),
          avaliacao_atendimento: parseInt(rowObj['Pergunta2 1 PERGUNTA ATENDENTE']) || null,
          avaliacao_solucao: parseInt(rowObj['Pergunta2 2 PERGUNTA SOLUCAO']) || null,
          chamada: rowObj['Chamada'] || '',
          desconexao: rowObj['Desconexão'] || '',
          id: rowObj['Id Ligação'] || Math.random()
        });
        operadores.add(operador);
      }
      
      // Processar Módulo "Ações de Operador"
      if (isModuloOperador && rowObj['Duração'] && rowObj['Motivo da Pauda']) {
        acoesOperador.push({
          duracao: rowObj['Duração'] || '',
          duracao_segundos: hmsToSeconds(rowObj['Duração']),
          motivo_pausa: rowObj['Motivo da Pauda'] || '',
          data_pausa: rowObj['Data Inicial'] || '',
          tm_logado_dia: rowObj['T M Logado / Dia'] || '',
          tm_logado_segundos: hmsToSeconds(rowObj['T M Logado / Dia']),
          tm_pausado: rowObj['T M Pausado'] || '',
          tm_pausado_segundos: hmsToSeconds(rowObj['T M Pausado']),
          id: Math.random()
        });
      }
      });
      
      // Log de progresso para arquivos grandes
      if (totalRows > 5000) {
        const progress = Math.round(((i + batchSize) / totalRows) * 100);
        console.log(`📈 Progresso: ${Math.min(progress, 100)}% (${i + batchSize}/${totalRows} linhas)`);
      }
    }
    
    const operadoresList = Array.from(operadores).sort();
    
    // Retornar dados baseado no tipo de módulo detectado
    if (isModuloLigacoes && isModuloOperador) {
      // Planilha mista - ambos os módulos
      return { 
        tipo: 'misto',
        atendimentos, 
        operadores: operadoresList,
        acoesOperador
      };
    } else if (isModuloLigacoes) {
      // Apenas módulo de ligações
      return { 
        tipo: 'ligacoes',
        atendimentos, 
        operadores: operadoresList
      };
    } else if (isModuloOperador) {
      // Apenas módulo de operador
      return { 
        tipo: 'operador',
        acoesOperador
      };
    } else {
      // Tipo não reconhecido
      throw new Error('Tipo de planilha não reconhecido. Verifique se contém os campos necessários.');
    }
  } catch (error) {
    throw new Error('Erro ao processar planilha: ' + error.message);
  }
};

// ROTAS DA API

// Upload e processamento de planilha (otimizado para Vercel gratuito)
app.post('/api/upload', upload.single('planilha'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const fileSizeMB = (req.file.size / 1024 / 1024).toFixed(2);
    console.log('Arquivo recebido:', req.file.filename, 'Tamanho:', fileSizeMB + 'MB');
    
    // Para arquivos grandes (> 2MB), salvar e retornar ID para processamento posterior
    if (req.file.size > 2 * 1024 * 1024) {
      return res.json({
        success: true,
        message: 'Arquivo grande detectado. Use o endpoint /api/process-large para processar.',
        processing: false,
        fileId: req.file.filename,
        fileSize: fileSizeMB + 'MB',
        nextStep: 'POST /api/process-large com { "fileId": "' + req.file.filename + '" }'
      });
    }
    
    // Para arquivos pequenos, processar normalmente
    const resultado = await new Promise((resolve, reject) => {
      try {
        const data = processarPlanilha(req.file.path);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    
    // Salvar dados processados
    const dadosFile = `data/${Date.now()}-dados.json`;
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data');
    }
    fs.writeFileSync(dadosFile, JSON.stringify(resultado, null, 2));
    
    // Limpar arquivo temporário
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      message: 'Planilha processada com sucesso',
      data: resultado,
      totalAtendimentos: resultado.atendimentos.length,
      totalOperadores: resultado.operadores.length
    });
    
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ 
      error: 'Erro ao processar planilha',
      details: error.message 
    });
  }
});

// Buscar dados salvos
app.get('/api/dados', (req, res) => {
  try {
    const dataDir = 'data';
    if (!fs.existsSync(dataDir)) {
      return res.json({ atendimentos: [], operadores: [] });
    }
    
    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse(); // Mais recente primeiro
    
    if (files.length === 0) {
      return res.json({ atendimentos: [], operadores: [] });
    }
    
    const latestFile = path.join(dataDir, files[0]);
    const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// Limpar dados
app.delete('/api/dados', (req, res) => {
  try {
    const dataDir = 'data';
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(dataDir, file));
      });
    }
    res.json({ success: true, message: 'Dados limpos com sucesso' });
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    res.status(500).json({ error: 'Erro ao limpar dados' });
  }
});

// Processamento em background para arquivos grandes
app.post('/api/process-large', async (req, res) => {
  try {
    const { fileId } = req.body;
    
    if (!fileId) {
      return res.status(400).json({ error: 'ID do arquivo não fornecido' });
    }
    
    // Buscar arquivo na pasta uploads
    const uploadsDir = 'uploads';
    const files = fs.readdirSync(uploadsDir);
    const file = files.find(f => f.includes(fileId));
    
    if (!file) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    const filePath = path.join(uploadsDir, file);
    
    // Processar arquivo grande
    console.log('🔄 Iniciando processamento em background:', file);
    const resultado = processarPlanilha(filePath);
    
    // Salvar dados processados
    const dadosFile = `data/${Date.now()}-dados.json`;
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data');
    }
    fs.writeFileSync(dadosFile, JSON.stringify(resultado, null, 2));
    
    // Limpar arquivo temporário
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'Arquivo grande processado com sucesso',
      data: resultado,
      totalAtendimentos: resultado.atendimentos.length,
      totalOperadores: resultado.operadores.length
    });
    
  } catch (error) {
    console.error('Erro no processamento em background:', error);
    res.status(500).json({ 
      error: 'Erro ao processar arquivo grande',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: 'enabled'
  });
});

// Teste simples
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API Veloinsights rodando na porta ${PORT}`);
  console.log(`📊 API disponível em: http://localhost:${PORT}/api`);
  console.log(`💾 Uploads em: http://localhost:${PORT}/api/upload`);
});
