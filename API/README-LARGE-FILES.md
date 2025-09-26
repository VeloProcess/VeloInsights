# 🚀 Veloinsights API - Otimizada para Arquivos Grandes

## 📊 **SUPORTE PARA ARQUIVOS GRANDES**

### **Limites Atualizados:**
- ✅ **Tamanho máximo:** 100MB (anteriormente 10MB)
- ✅ **Timeout:** 60 segundos (Vercel Pro)
- ✅ **Processamento:** Em lotes de 1000 linhas
- ✅ **Memória:** Otimizada para arquivos grandes

### **Arquivos Suportados:**
- 📄 **Excel:** .xlsx, .xls (até 100MB)
- 📊 **CSV:** .csv (até 100MB)
- 📈 **Planilhas:** Com milhares de linhas

---

## 🔧 **OTIMIZAÇÕES IMPLEMENTADAS**

### **1. Processamento em Lotes**
```javascript
const batchSize = 1000; // Processar 1000 linhas por vez
for (let i = 0; i < totalRows; i += batchSize) {
  const batch = rows.slice(i, i + batchSize);
  // Processar lote...
}
```

### **2. Configuração XLSX Otimizada**
```javascript
const workbook = XLSX.readFile(filePath, {
  cellDates: true,
  cellNF: false,        // Desabilita formatação
  cellText: false,      // Desabilita texto
  raw: false,          // Desabilita dados brutos
  dense: false,        // Desabilita arrays densos
  sheetRows: 0,        // Todas as linhas
  bookDeps: false      // Sem dependências extras
});
```

### **3. Logs de Progresso**
- 📈 Progresso em tempo real para arquivos > 5000 linhas
- 📊 Contagem de linhas processadas
- ⏱️ Tempo de processamento

### **4. Timeout Estendido**
- ⏰ **Vercel:** 60 segundos (Pro plan)
- 🔄 **Processamento assíncrono**
- 💾 **Salvamento incremental**

---

## 📋 **CONFIGURAÇÃO VERCEL**

### **vercel.json Otimizado:**
```json
{
  "functions": {
    "server.js": {
      "maxDuration": 60
    }
  }
}
```

### **Para Arquivos > 100MB:**
1. **Upgrade Vercel Pro** (necessário para timeout > 10s)
2. **Processamento local** como fallback
3. **Divisão de arquivos** em partes menores

---

## 🚀 **DEPLOY COM SUPORTE A ARQUIVOS GRANDES**

### **1. Deploy da API:**
```bash
cd API
npm install
vercel --prod
```

### **2. Configurar Vercel Pro:**
- Upgrade para plano Pro
- Configurar timeout de 60s
- Habilitar logs detalhados

### **3. Testar com Arquivo Grande:**
```bash
# Teste com arquivo de 50MB
curl -X POST -F "planilha=@arquivo.xlsx" https://sua-api.vercel.app/api/upload
```

---

## 📊 **PERFORMANCE ESPERADA**

### **Arquivos Pequenos (< 10MB):**
- ⚡ **Processamento:** < 5 segundos
- 📊 **Linhas:** Até 10.000
- 💾 **Memória:** < 100MB

### **Arquivos Médios (10-50MB):**
- ⏱️ **Processamento:** 10-30 segundos
- 📊 **Linhas:** 10.000-50.000
- 💾 **Memória:** 100-500MB

### **Arquivos Grandes (50-100MB):**
- ⏰ **Processamento:** 30-60 segundos
- 📊 **Linhas:** 50.000-100.000+
- 💾 **Memória:** 500MB-1GB

---

## 🔒 **SEGURANÇA MANTIDA**

### **Validações Ativas:**
- ✅ **Tamanho:** Máximo 100MB
- ✅ **Tipo:** Apenas .xlsx, .xls, .csv
- ✅ **Sanitização:** Dados de entrada
- ✅ **Rate Limiting:** 100 req/15min
- ✅ **CORS:** Origens permitidas

### **Proteções:**
- 🛡️ **Helmet:** Headers de segurança
- 🔒 **Validação:** Estrutura de planilha
- 🧹 **Limpeza:** Arquivos temporários
- 📝 **Logs:** Detalhados para auditoria

---

## 📞 **SUPORTE PARA ARQUIVOS GRANDES**

### **Problemas Comuns:**
1. **Timeout:** Upgrade para Vercel Pro
2. **Memória:** Processar em lotes menores
3. **Erro de upload:** Verificar tamanho do arquivo
4. **Processamento lento:** Normal para arquivos grandes

### **Soluções:**
- 📈 **Monitorar logs** de progresso
- ⏱️ **Aguardar processamento** completo
- 🔄 **Tentar novamente** se timeout
- 📊 **Dividir arquivo** se muito grande

---

## 🎯 **RESULTADO FINAL**

✅ **Suporte completo** para arquivos de 50MB+  
✅ **Processamento otimizado** em lotes  
✅ **Timeout estendido** para 60 segundos  
✅ **Logs de progresso** em tempo real  
✅ **Segurança mantida** com validações  
✅ **Performance melhorada** para arquivos grandes  

Agora a API está preparada para processar seus arquivos de 50MB+ sem problemas! 🚀
