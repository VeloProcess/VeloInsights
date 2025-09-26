# 🔧 API VeloInsights

## 📋 **VISÃO GERAL**

API backend para processamento de planilhas de atendimentos da Velotax. Desenvolvida em Node.js + Express com suporte a arquivos grandes.

---

## 🚀 **INSTALAÇÃO**

```bash
cd api
npm install
```

## 🏃 **EXECUÇÃO**

### **Desenvolvimento:**
```bash
npm run dev
```

### **Produção:**
```bash
npm start
```

---

## 📊 **ENDPOINTS**

### **1. Upload de Planilha**
```http
POST /api/upload
Content-Type: multipart/form-data

Body:
- planilha: arquivo (.xlsx, .xls, .csv)
```

**Resposta (Arquivo Pequeno):**
```json
{
  "success": true,
  "message": "Planilha processada com sucesso",
  "data": {
    "atendimentos": [...],
    "operadores": [...]
  },
  "totalAtendimentos": 1500,
  "totalOperadores": 25
}
```

**Resposta (Arquivo Grande):**
```json
{
  "success": true,
  "message": "Arquivo grande detectado. Use o endpoint /api/process-large para processar.",
  "processing": false,
  "fileId": "1234567890-planilha.xlsx",
  "fileSize": "15.2MB",
  "nextStep": "POST /api/process-large com { \"fileId\": \"1234567890-planilha.xlsx\" }"
}
```

### **2. Processar Arquivo Grande**
```http
POST /api/process-large
Content-Type: application/json

Body:
{
  "fileId": "1234567890-planilha.xlsx"
}
```

### **3. Buscar Dados Processados**
```http
GET /api/dados
```

**Resposta:**
```json
{
  "atendimentos": [
    {
      "operador": "João Silva",
      "data_atendimento": "2024-01-15T10:30:00.000Z",
      "duracao_segundos": 180,
      "avaliacao_atendimento": 5,
      "avaliacao_solucao": 4,
      "id": "12345"
    }
  ],
  "operadores": ["João Silva", "Maria Santos"]
}
```

### **4. Limpar Dados**
```http
DELETE /api/dados
```

### **5. Health Check**
```http
GET /api/health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

---

## 🔒 **SEGURANÇA**

### **Validações:**
- ✅ **Tipo de arquivo:** Apenas .xlsx, .xls, .csv
- ✅ **Tamanho máximo:** 100MB
- ✅ **Rate limiting:** 100 requests/15min por IP
- ✅ **Sanitização:** Limpeza de dados de entrada
- ✅ **CORS:** Domínios específicos configurados

### **Headers de Segurança:**
- `helmet()` - Headers de segurança
- `compression()` - Compressão gzip
- `express-rate-limit` - Limite de requisições

---

## 📈 **PERFORMANCE**

### **Processamento Otimizado:**
- **Arquivos pequenos (< 5MB):** Processamento imediato
- **Arquivos grandes (> 5MB):** Processamento em background
- **Lotes:** 1000 linhas por vez
- **Progresso:** Logs para arquivos > 5000 linhas

### **Configurações XLSX:**
```javascript
const workbook = XLSX.readFile(filePath, {
  cellDates: true,
  cellNF: false,
  cellText: false,
  raw: false,
  dense: false,
  sheetRows: 0,
  bookDeps: false
});
```

---

## 🎯 **FORMATO DA PLANILHA**

### **Colunas Esperadas:**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| Chamada | String | Status (deve conter "Atendida") |
| Operador | String | Nome do atendente |
| Data Atendimento | String | DD/MM/AAAA |
| Hora Atendimento | String | HH:MM:SS |
| Tempo Falado | String | HH:MM:SS |
| Pergunta2 1 PERGUNTA ATENDENTE | Number | Avaliação 1-5 |
| Pergunta2 2 PERGUNTA SOLUCAO | Number | Avaliação 1-5 |
| Id Ligação | String | ID único |

### **Exemplo de Dados:**
```
Chamada | Operador | Data Atendimento | Hora Atendimento | Tempo Falado | Pergunta2 1 PERGUNTA ATENDENTE | Pergunta2 2 PERGUNTA SOLUCAO | Id Ligação
Atendida | João Silva | 15/01/2024 | 10:30:00 | 00:03:00 | 5 | 4 | 12345
```

---

## 🔧 **CONFIGURAÇÃO**

### **Variáveis de Ambiente:**
```bash
PORT=3001
NODE_ENV=production
```

### **CORS (Produção):**
```javascript
origin: ['https://veloinsights-app.vercel.app']
```

### **CORS (Desenvolvimento):**
```javascript
origin: ['http://localhost:3000']
```

---

## 📁 **ESTRUTURA DE ARQUIVOS**

```
api/
├── server.js          # Servidor principal
├── package.json        # Dependências
├── vercel.json         # Configuração Vercel
├── .npmrc             # Configuração npm
├── uploads/            # Arquivos temporários
└── data/              # Dados processados
```

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "Arquivo não encontrado"**
- Verificar se arquivo foi enviado
- Confirmar tipo de arquivo (.xlsx, .xls, .csv)

### **Erro: "Arquivo muito grande"**
- Limite de 100MB
- Usar endpoint `/api/process-large`

### **Erro: "Timeout"**
- Arquivo muito grande para Vercel gratuito
- Considerar upgrade para Vercel Pro

### **Erro: "CORS"**
- Verificar domínios configurados
- Confirmar URLs no frontend

---

## 📞 **SUPORTE**

Para problemas:
1. Verificar logs na Vercel Dashboard
2. Testar endpoints com Postman/Insomnia
3. Validar formato da planilha
4. Verificar configurações de CORS
