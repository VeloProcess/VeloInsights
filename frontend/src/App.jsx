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
      console.log('📁 Iniciando upload do arquivo:', file.name, 'Tamanho:', (file.size / 1024 / 1024).toFixed(2) + 'MB')
      


      // Para arquivos grandes (>10MB), usar upload em chunks
      if (file.size > 10 * 1024 * 1024) {
        console.log('📊 Arquivo grande detectado, usando upload em chunks')
        await uploadLargeFile(file)
        return
      }
      
      const formData = new FormData()
      formData.append('planilha', file)

      console.log('🌐 Fazendo requisição para:', 'https://velo-insights.vercel.app/api/upload')
      
      const response = await fetch('https://velo-insights.vercel.app/api/upload', {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit'
      })

      console.log('📊 Response status:', response.status)
      console.log('📊 Response headers:', response.headers)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('📊 Resultado do upload:', result)
      
      if (result.success) {
        console.log('✅ Upload bem-sucedido:', result)
        
        if (result.processing === false) {
          // Arquivo grande - mostrar mensagem
          alert('Arquivo grande recebido! (' + result.file.size + ') - Processamento em background.')
        } else {
          // Arquivo pequeno - processado diretamente
          alert('Upload realizado com sucesso! Arquivo: ' + result.file.name)
          if (result.data) {
            setDados(result.data)
          }
        }
      } else {
        console.error('❌ Upload falhou:', result)
        alert('Erro no upload: ' + result.message)
      }
    } catch (error) {
      console.error('❌ Erro no upload:', error)
      alert('Erro no upload: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const uploadLargeFile = async (file) => {
    try {
      console.log('📊 Iniciando upload em chunks para arquivo grande')
      
      // Dividir arquivo em chunks de 5MB
      const chunkSize = 5 * 1024 * 1024
      const totalChunks = Math.ceil(file.size / chunkSize)
      const fileId = 'file_' + Date.now()
      
      console.log('📊 Total de chunks:', totalChunks)
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)
        
        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('fileId', fileId)
        formData.append('chunkIndex', i)
        formData.append('totalChunks', totalChunks)
        formData.append('fileName', file.name)
        
        console.log(`📊 Enviando chunk ${i + 1}/${totalChunks}`)
        
        const response = await fetch('https://velo-insights.vercel.app/api/upload-chunk', {
          method: 'POST',
          body: formData,
          mode: 'cors',
          credentials: 'omit'
        })
        
        if (!response.ok) {
          throw new Error(`Erro no chunk ${i + 1}: ${response.status}`)
        }
        
        const result = await response.json()
        console.log(`📊 Chunk ${i + 1} enviado:`, result)
      }
      
      // Processar arquivo completo
      console.log('📊 Todos os chunks enviados, processando arquivo completo')
      const processResponse = await fetch('https://velo-insights.vercel.app/api/process-chunks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: fileId, fileName: file.name }),
        mode: 'cors',
        credentials: 'omit'
      })
      
      if (!processResponse.ok) {
        throw new Error(`Erro ao processar arquivo: ${processResponse.status}`)
      }
      
      const processResult = await processResponse.json()
      console.log('📊 Arquivo processado:', processResult)
      
      if (processResult.success) {
        alert('Upload realizado com sucesso! Arquivo: ' + file.name)
        if (processResult.data) {
          setDados(processResult.data)
        }
      } else {
        alert('Erro ao processar arquivo: ' + processResult.message)
      }
      
    } catch (error) {
      console.error('❌ Erro no upload em chunks:', error)
      alert('Erro no upload em chunks: ' + error.message)
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
