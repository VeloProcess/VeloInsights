# 🎨 Frontend VeloInsights

## 📋 **VISÃO GERAL**

Frontend React para dashboard de atendimentos da Velotax. Desenvolvido com React 18 + Vite, Chart.js e design system VeloHub.

---

## 🚀 **INSTALAÇÃO**

```bash
cd frontend
npm install
```

## 🏃 **EXECUÇÃO**

### **Desenvolvimento:**
```bash
npm run dev
```

### **Build:**
```bash
npm run build
```

### **Preview:**
```bash
npm run preview
```

---

## 🎯 **FUNCIONALIDADES**

### **Dashboard Geral:**
- 📊 Total de atendimentos
- ⏱️ Duração média por atendimento
- ⭐ Avaliação média do atendente
- ✅ Avaliação média da solução
- 👥 Número de operadores únicos
- 🕒 Atendimentos no horário comercial

### **Análise Individual:**
- 🔍 Métricas específicas por operador
- 📋 Lista detalhada de atendimentos
- 📈 Gráficos personalizados
- 📊 Comparação de performance

### **Upload de Dados:**
- 📁 Suporte a .xlsx, .xls, .csv
- 📏 Arquivos até 100MB
- ⚡ Processamento em background
- ✅ Validação de dados

---

## 🛠️ **TECNOLOGIAS**

### **Core:**
- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Chart.js** - Gráficos interativos
- **React-Chartjs-2** - Wrapper React para Chart.js

### **UI/UX:**
- **React-Dropzone** - Upload de arquivos
- **React-DatePicker** - Seleção de datas
- **Date-fns** - Manipulação de datas

### **Processamento:**
- **XLSX** - Leitura de planilhas (client-side)

---

## 📊 **COMPONENTES**

### **Dashboard:**
```jsx
<Dashboard 
  dados={dados}
  operadorSelecionado={operadorSelecionado}
  onOperadorChange={setOperadorSelecionado}
/>
```

### **Upload:**
```jsx
<Upload 
  onUpload={handleUpload}
  onUploadLarge={handleUploadLarge}
  loading={loading}
/>
```

### **Gráficos:**
```jsx
<GraficoAtendimentos dados={dados} />
<GraficoAvaliacoes dados={dados} />
<GraficoDuracao dados={dados} />
```

---

## 🎨 **DESIGN SYSTEM**

### **Paleta de Cores:**
```css
:root {
  --velo-primary: #1e40af;
  --velo-secondary: #3b82f6;
  --velo-accent: #60a5fa;
  --velo-success: #10b981;
  --velo-warning: #f59e0b;
  --velo-error: #ef4444;
  --velo-gray: #6b7280;
  --velo-light: #f8fafc;
}
```

### **Tipografia:**
- **Títulos:** Anton (Google Fonts)
- **Corpo:** Poppins (Google Fonts)
- **Mono:** JetBrains Mono

### **Componentes:**
- **Botões:** VeloHub Button System
- **Cards:** VeloHub Card System
- **Formulários:** VeloHub Form System
- **Gráficos:** Chart.js com tema VeloHub

---

## 📱 **RESPONSIVIDADE**

### **Breakpoints:**
```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

### **Layout:**
- **Mobile:** Stack vertical, navegação por tabs
- **Tablet:** Grid 2 colunas, sidebar colapsável
- **Desktop:** Grid 3 colunas, sidebar fixa

---

## 🔧 **CONFIGURAÇÃO**

### **Vite Config:**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### **Environment Variables:**
```bash
VITE_API_URL=https://veloinsights-api.vercel.app
VITE_APP_NAME=VeloInsights
VITE_APP_VERSION=2.0.0
```

---

## 📊 **ESTRUTURA DE DADOS**

### **Dados de Atendimento:**
```typescript
interface Atendimento {
  operador: string;
  data_atendimento: Date;
  duracao_segundos: number;
  avaliacao_atendimento: number;
  avaliacao_solucao: number;
  id: string;
}
```

### **Dados do Dashboard:**
```typescript
interface DashboardData {
  atendimentos: Atendimento[];
  operadores: string[];
  totalAtendimentos: number;
  duracaoMedia: number;
  avaliacaoMediaAtendimento: number;
  avaliacaoMediaSolucao: number;
  operadoresUnicos: number;
  atendimentosHorarioComercial: number;
}
```

---

## 🎯 **ROTAS**

### **Estrutura:**
```
/                    # Dashboard principal
/operador/:nome      # Análise individual
/upload              # Upload de dados
/settings            # Configurações
```

### **Navegação:**
- **Sidebar:** Navegação principal
- **Breadcrumbs:** Navegação contextual
- **Tabs:** Navegação por seções

---

## 📈 **PERFORMANCE**

### **Otimizações:**
- **React.memo:** Componentes otimizados
- **useMemo:** Cálculos pesados
- **useCallback:** Funções otimizadas
- **Lazy Loading:** Componentes sob demanda
- **Code Splitting:** Bundle otimizado

### **Bundle Size:**
- **Gzip:** ~150KB
- **Brotli:** ~120KB
- **Chunks:** Separados por rota

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "Failed to fetch"**
- Verificar URL da API
- Confirmar CORS configurado
- Testar endpoint manualmente

### **Erro: "Chart not rendering"**
- Verificar dados válidos
- Confirmar Chart.js carregado
- Verificar dimensões do container

### **Erro: "Upload failed"**
- Verificar tipo de arquivo
- Confirmar tamanho < 100MB
- Testar endpoint da API

---

## 📞 **SUPORTE**

Para problemas:
1. Verificar console do navegador
2. Testar em modo incógnito
3. Verificar network tab
4. Confirmar API funcionando
