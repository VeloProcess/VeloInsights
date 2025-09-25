# Velodados - Dashboard de Atendimentos

Sistema de análise de dados de atendimentos desenvolvido para a Velotax, com arquitetura local sem backend.

## 🚀 Funcionalidades

- **Upload de Planilhas**: Suporte para arquivos .xlsx e .csv
- **Dashboard Geral**: Métricas consolidadas de toda a operação
- **Análise Individual**: Dashboard específico por operador
- **Filtros de Data**: Análise por período específico
- **Gráficos Interativos**: Visualizações com Chart.js
- **Interface Responsiva**: Design moderno e adaptável

## 📊 Métricas Disponíveis

### Dashboard Geral
- Total de atendimentos
- Duração média por atendimento
- Avaliação média do atendente
- Avaliação média da solução
- Número de operadores únicos
- Atendimentos no período de funcionamento (8h-19h)

### Dashboard Individual
- Métricas específicas do operador selecionado
- Lista detalhada de atendimentos
- Gráficos personalizados por operador

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework frontend
- **Vite** - Build tool e dev server
- **Chart.js** - Gráficos e visualizações
- **React DatePicker** - Seleção de datas
- **React Dropzone** - Upload de arquivos
- **XLSX** - Processamento de planilhas
- **Date-fns** - Manipulação de datas

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse `http://localhost:3000` no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── AtendimentoItem.jsx
│   ├── CardIndicador.jsx
│   ├── DashboardGeral.jsx
│   ├── DashboardOperador.jsx
│   ├── FiltroData.jsx
│   ├── GraficoAtendimentosPorDia.jsx
│   ├── GraficoAvaliacoes.jsx
│   ├── Header.jsx
│   ├── SeletorOperador.jsx
│   └── Uploader.jsx
├── context/            # Contexto React para estado global
│   └── DataContext.jsx
├── utils/              # Utilitários
│   └── dataParser.js
├── App.jsx             # Componente principal
├── main.jsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 📋 Formato da Planilha

O sistema espera uma planilha com as seguintes colunas:
- **Chamada**: Status da chamada (deve conter "Atendida")
- **Operador**: Nome do operador
- **Data Atendimento**: Data no formato DD/MM/AAAA
- **Hora Atendimento**: Hora no formato HH:MM:SS
- **Tempo Falado**: Duração no formato HH:MM:SS
- **Pergunta2 1 PERGUNTA ATENDENTE**: Avaliação do atendente (1-5)
- **Pergunta2 2 PERGUNTA SOLUCAO**: Avaliação da solução (1-5)
- **Id Ligação**: ID único da ligação

## 🎨 Design

O sistema utiliza um design profissional baseado nas diretrizes da Velotax, com:
- Cores corporativas (#0052cc como cor primária)
- Interface limpa e intuitiva
- Componentes responsivos
- Tipografia moderna (Inter)

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Smartphone

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção

## 📄 Licença

Este projeto é propriedade da Velotax e destinado ao uso interno da empresa.
