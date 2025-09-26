# 🚀 VeloInsights - Dashboard de Atendimentos

Sistema completo de análise de dados de atendimentos desenvolvido para a Velotax, com arquitetura moderna e suporte a arquivos grandes.

## 📊 **VISÃO GERAL**

O VeloInsights é uma solução completa que permite:
- 📈 **Análise de dados** de atendimentos em tempo real
- 📊 **Dashboard interativo** com gráficos e métricas
- 📁 **Upload de planilhas** grandes (até 100MB)
- 🔍 **Análise individual** por operador
- 📅 **Filtros de data** flexíveis

---

## 🏗️ **ARQUITETURA**

### **Backend (API):**
- **Tecnologia:** Node.js + Express
- **Processamento:** XLSX otimizado para arquivos grandes
- **Deploy:** Vercel (plano gratuito)
- **URL:** `https://veloinsights-api.vercel.app`

### **Frontend:**
- **Tecnologia:** React 18 + Vite
- **UI:** Design system VeloHub
- **Gráficos:** Chart.js
- **Deploy:** Vercel (plano gratuito)
- **URL:** `https://veloinsights-app.vercel.app`

---

## 📁 **ESTRUTURA DO PROJETO**

```
VeloInsights/
├── api/                    # Backend API
│   ├── package.json        # Dependências da API
│   ├── server.js          # Servidor principal
│   ├── vercel.json        # Configuração Vercel
│   └── README.md          # Documentação da API
├── frontend/               # Frontend React
│   ├── package.json        # Dependências do Frontend
│   ├── vite.config.js     # Configuração Vite
│   ├── vercel.json        # Configuração Vercel
│   ├── src/               # Código fonte React
│   └── README.md          # Documentação do Frontend
├── docs/                   # Documentação
│   ├── DEPLOY.md          # Guia de deploy
│   ├── API.md             # Documentação da API
│   └── FRONTEND.md        # Documentação do Frontend
├── scripts/                # Scripts úteis
│   ├── deploy.sh          # Deploy automático
│   └── dev.sh             # Desenvolvimento local
└── README.md              # Este arquivo
```

---

## 🚀 **DEPLOY RÁPIDO**

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

## 📊 **FUNCIONALIDADES**

### **Dashboard Geral:**
- Total de atendimentos
- Duração média por atendimento
- Avaliação média do atendente
- Avaliação média da solução
- Número de operadores únicos
- Atendimentos no horário comercial

### **Análise Individual:**
- Métricas específicas por operador
- Lista detalhada de atendimentos
- Gráficos personalizados
- Comparação de performance

### **Upload de Dados:**
- Suporte a .xlsx, .xls, .csv
- Arquivos até 100MB
- Processamento em background
- Validação de dados

---

## 🛠️ **TECNOLOGIAS**

### **Backend:**
- Node.js 18+
- Express.js
- XLSX (processamento de planilhas)
- Multer (upload de arquivos)
- CORS (comunicação frontend)

### **Frontend:**
- React 18
- Vite (build tool)
- Chart.js (gráficos)
- React-Dropzone (upload)
- Date-fns (manipulação de datas)

---

## 📋 **FORMATO DA PLANILHA**

O sistema espera planilhas com as colunas:
- **Chamada:** Status (deve conter "Atendida")
- **Operador:** Nome do atendente
- **Data Atendimento:** DD/MM/AAAA
- **Hora Atendimento:** HH:MM:SS
- **Tempo Falado:** HH:MM:SS
- **Pergunta2 1 PERGUNTA ATENDENTE:** Avaliação 1-5
- **Pergunta2 2 PERGUNTA SOLUCAO:** Avaliação 1-5
- **Id Ligação:** ID único

---

## 🎨 **DESIGN SYSTEM**

- **Paleta:** Azuis corporativos Velotax
- **Tipografia:** Poppins + Anton
- **Componentes:** Sistema VeloHub
- **Responsividade:** Mobile-first
- **Tema:** Claro/Escuro

---

## 📞 **SUPORTE**

Para problemas ou dúvidas:
1. Verificar logs na Vercel Dashboard
2. Testar endpoints da API
3. Validar formato da planilha
4. Verificar configurações de CORS

---

## 📄 **LICENÇA**

Este projeto é propriedade da Velotax e destinado ao uso interno da empresa.

---

## 🏷️ **VERSÃO**

**v2.0.0** - Arquitetura separada com suporte a arquivos grandes