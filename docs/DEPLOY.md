# 📚 Documentação VeloInsights

## 🚀 **GUIA DE DEPLOY**

### **1. Deploy da API:**
```bash
cd api
vercel --prod
```

### **2. Deploy do Frontend:**
```bash
cd frontend
npm run build
vercel --prod
```

---

## 🔧 **CONFIGURAÇÃO VERCEL**

### **API Project:**
- **Root Directory:** `api`
- **Build Command:** `npm install`
- **Output Directory:** (deixar vazio)
- **Framework:** Other

### **Frontend Project:**
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite

---

## 📊 **ENDPOINTS DA API**

### **Upload de Arquivo:**
```
POST /api/upload
Content-Type: multipart/form-data
Body: planilha (file)
```

### **Processar Arquivo Grande:**
```
POST /api/process-large
Content-Type: application/json
Body: { "fileId": "filename" }
```

### **Buscar Dados:**
```
GET /api/dados
```

### **Limpar Dados:**
```
DELETE /api/dados
```

### **Health Check:**
```
GET /api/health
```

---

## 🎯 **FORMATO DA PLANILHA**

### **Colunas Obrigatórias:**
- **Chamada:** Status (deve conter "Atendida")
- **Operador:** Nome do atendente
- **Data Atendimento:** DD/MM/AAAA
- **Hora Atendimento:** HH:MM:SS
- **Tempo Falado:** HH:MM:SS
- **Pergunta2 1 PERGUNTA ATENDENTE:** Avaliação 1-5
- **Pergunta2 2 PERGUNTA SOLUCAO:** Avaliação 1-5
- **Id Ligação:** ID único

### **Formatos Suportados:**
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)
- `.csv` (Comma Separated Values)

---

## 🔒 **SEGURANÇA**

### **Validações Implementadas:**
- ✅ Tipo de arquivo (apenas .xlsx, .xls, .csv)
- ✅ Tamanho máximo (100MB)
- ✅ Sanitização de dados
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configurado
- ✅ Helmet security headers

### **Vulnerabilidades Conhecidas:**
- `xlsx` package tem vulnerabilidades conhecidas
- **Mitigação:** Validações customizadas + `.npmrc` ignore

---

## 📈 **PERFORMANCE**

### **Arquivos Pequenos (< 5MB):**
- Processamento imediato
- Resposta em < 10 segundos

### **Arquivos Grandes (> 5MB):**
- Upload + ID de arquivo
- Processamento em background
- Endpoint separado para processar

### **Otimizações:**
- Processamento em lotes (1000 linhas)
- Compressão gzip
- Cache de dados processados

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "No Output Directory"**
- Verificar se `Root Directory` está como `frontend`
- Confirmar se `Output Directory` está como `dist`

### **Erro: "CORS"**
- Verificar URLs no `server.js`
- Confirmar domínios na Vercel

### **Erro: "Arquivo muito grande"**
- Usar endpoint `/api/process-large`
- Verificar limite de 100MB

### **Erro: "Timeout"**
- Arquivo muito grande para Vercel gratuito
- Considerar upgrade para Vercel Pro

---

## 📞 **SUPORTE**

Para problemas:
1. Verificar logs na Vercel Dashboard
2. Testar endpoints da API
3. Validar formato da planilha
4. Verificar configurações de CORS
