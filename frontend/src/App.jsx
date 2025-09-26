import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import './index.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function App() {
  const [dados, setDados] = useState({ 
    tipo: 'ligacoes',
    atendimentos: [], 
    operadores: [],
    acoesOperador: []
  })
  const [loading, setLoading] = useState(false)
  const [operadorSelecionado, setOperadorSelecionado] = useState('')

  // Buscar dados da API
  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      const response = await fetch('https://velo-insights.vercel.app/api/dados')
      const data = await response.json()
      console.log('📊 Dados recebidos da API:', data)
      
      // Garantir que dados tenha estrutura válida
      const dadosSeguros = {
        tipo: data.tipo || 'ligacoes',
        atendimentos: data.atendimentos || [],
        operadores: data.operadores || [],
        acoesOperador: data.acoesOperador || []
      }
      
      setDados(dadosSeguros)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      // Manter dados padrão em caso de erro
      setDados({
        tipo: 'ligacoes',
        atendimentos: [],
        operadores: [],
        acoesOperador: []
      })
    }
  }

  const handleUpload = async (file) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('planilha', file)

      const response = await fetch('https://velo-insights.vercel.app/api/upload?t=' + Date.now(), {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Upload bem-sucedido:', result)
        
        if (result.processing === false) {
          // Arquivo grande - usar endpoint separado
          const processResponse = await fetch('https://velo-insights.vercel.app/api/process-large', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId: result.fileId })
          })
          const processResult = await processResponse.json()
          if (processResult.success) {
            // Garantir estrutura válida
            const dadosSeguros = {
              tipo: processResult.data?.tipo || 'ligacoes',
              atendimentos: processResult.data?.atendimentos || [],
              operadores: processResult.data?.operadores || [],
              acoesOperador: processResult.data?.acoesOperador || []
            }
            setDados(dadosSeguros)
          }
        } else {
          // Arquivo pequeno - processado diretamente
          const dadosSeguros = {
            tipo: result.data?.tipo || 'ligacoes',
            atendimentos: result.data?.atendimentos || [],
            operadores: result.data?.operadores || [],
            acoesOperador: result.data?.acoesOperador || []
          }
          setDados(dadosSeguros)
        }
      } else {
        console.error('❌ Upload falhou:', result)
      }
    } catch (error) {
      console.error('Erro no upload:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular métricas baseado no tipo de dados
  const totalAtendimentos = dados.atendimentos ? dados.atendimentos.length : 0
  const duracaoMedia = totalAtendimentos > 0 
    ? Math.round(dados.atendimentos.reduce((acc, att) => acc + att.duracao_segundos, 0) / totalAtendimentos)
    : 0
  
  const avaliacaoMediaAtendimento = totalAtendimentos > 0
    ? (dados.atendimentos.reduce((acc, att) => acc + (att.avaliacao_atendimento || 0), 0) / totalAtendimentos).toFixed(1)
    : 0

  const avaliacaoMediaSolucao = totalAtendimentos > 0
    ? (dados.atendimentos.reduce((acc, att) => acc + (att.avaliacao_solucao || 0), 0) / totalAtendimentos).toFixed(1)
    : 0

  // Métricas do módulo de operador
  const totalAcoesOperador = dados.acoesOperador ? dados.acoesOperador.length : 0
  const tempoMedioLogado = totalAcoesOperador > 0
    ? Math.round(dados.acoesOperador.reduce((acc, acao) => acc + acao.tm_logado_segundos, 0) / totalAcoesOperador)
    : 0

  const tempoMedioPausado = totalAcoesOperador > 0
    ? Math.round(dados.acoesOperador.reduce((acc, acao) => acc + acao.tm_pausado_segundos, 0) / totalAcoesOperador)
    : 0

  // Dados para gráfico
  const chartData = {
    labels: ['Total Atendimentos', 'Duração Média (seg)', 'Avaliação Atendimento', 'Avaliação Solução'],
    datasets: [{
      label: 'Métricas',
      data: [totalAtendimentos, duracaoMedia, parseFloat(avaliacaoMediaAtendimento), parseFloat(avaliacaoMediaSolucao)],
      backgroundColor: ['#1e40af', '#3b82f6', '#10b981', '#f59e0b']
    }]
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 VeloInsights</h1>
        <p>Dashboard de Atendimentos - Velotax</p>
      </header>

      <main className="main">
        <section className="upload-section">
          <h2>📁 Upload de Planilha</h2>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
            disabled={loading}
          />
          {loading && <p>⏳ Processando...</p>}
        </section>

        <section className="metrics-section">
          <h2>📊 Métricas - {dados.tipo === 'ligacoes' ? 'Detalhes de Ligações' : dados.tipo === 'operador' ? 'Ações de Operador' : 'Módulo Misto'}</h2>
          <div className="metrics-grid">
            {dados.tipo === 'ligacoes' || dados.tipo === 'misto' ? (
              <>
                <div className="metric-card">
                  <h3>Total Atendimentos</h3>
                  <p className="metric-value">{totalAtendimentos}</p>
                </div>
                <div className="metric-card">
                  <h3>Duração Média</h3>
                  <p className="metric-value">{duracaoMedia}s</p>
                </div>
                <div className="metric-card">
                  <h3>Avaliação Atendimento</h3>
                  <p className="metric-value">{avaliacaoMediaAtendimento}/5</p>
                </div>
                <div className="metric-card">
                  <h3>Avaliação Solução</h3>
                  <p className="metric-value">{avaliacaoMediaSolucao}/5</p>
                </div>
              </>
            ) : null}
            
            {dados.tipo === 'operador' || dados.tipo === 'misto' ? (
              <>
                <div className="metric-card">
                  <h3>Total Ações</h3>
                  <p className="metric-value">{totalAcoesOperador}</p>
                </div>
                <div className="metric-card">
                  <h3>Tempo Médio Logado</h3>
                  <p className="metric-value">{tempoMedioLogado}s</p>
                </div>
                <div className="metric-card">
                  <h3>Tempo Médio Pausado</h3>
                  <p className="metric-value">{tempoMedioPausado}s</p>
                </div>
              </>
            ) : null}
          </div>
        </section>

        <section className="chart-section">
          <h2>📈 Gráfico de Métricas</h2>
          <div className="chart-container">
            <Bar data={chartData} options={{
              responsive: true,
              plugins: {
                title: { display: true, text: 'Métricas de Atendimentos' }
              }
            }} />
          </div>
        </section>

        {(dados.operadores && dados.operadores.length > 0) && (
          <section className="operadores-section">
            <h2>👥 Operadores</h2>
            <div className="operadores-list">
              {dados.operadores.map(operador => (
                <div key={operador} className="operador-item">
                  {operador}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
