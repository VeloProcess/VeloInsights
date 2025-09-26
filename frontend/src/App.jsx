import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  async function handleFileUpload(acceptedFiles) {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('planilha', file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setDados(result.data);
      } else {
        setError(result.message || 'Erro ao processar arquivo');
      }
    } catch (err) {
      setError('Erro de conexão com a API');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDados();
  }, []);

  async function fetchDados() {
    try {
      const response = await fetch(`${API_URL}/api/dados`);
      const result = await response.json();
      setDados(result);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  }

  const chartData = dados ? {
    labels: dados.operadores?.map(op => op.nome) || [],
    datasets: [
      {
        label: 'Tempo Logado (min)',
        data: dados.operadores?.map(op => op.tempoLogado) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Métricas de Operadores'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-['Anton']">
                VeloInsights
              </h1>
              <p className="text-gray-600">Dashboard de Atendimentos</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {dados ? `${dados.totalAtendimentos || 0} atendimentos` : 'Nenhum dado'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upload de Planilha
          </h2>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-gray-600">
                {isDragActive
                  ? 'Solte o arquivo aqui...'
                  : 'Arraste e solte uma planilha aqui, ou clique para selecionar'}
              </p>
              <p className="text-sm text-gray-500">
                Suporta .xlsx, .xls, .csv (até 100MB)
              </p>
            </div>
          </div>

          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando arquivo...
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erro</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        {dados && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gráfico de Operadores
              </h3>
              {chartData && (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estatísticas
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de Atendimentos:</span>
                  <span className="font-semibold">{dados.totalAtendimentos || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operadores:</span>
                  <span className="font-semibold">{dados.operadores?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Período:</span>
                  <span className="font-semibold">
                    {format(dataInicio, 'dd/MM/yyyy')} - {format(dataFim, 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!dados && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum dado disponível</h3>
            <p className="mt-1 text-sm text-gray-500">
              Faça upload de uma planilha para visualizar os dados.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;