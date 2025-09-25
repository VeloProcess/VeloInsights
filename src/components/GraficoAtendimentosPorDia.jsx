import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GraficoAtendimentosPorDia({ dados }) {
  const chartData = useMemo(() => {
    // Agrupa os dados por dia
    const dadosPorDia = {};
    
    dados.forEach(atendimento => {
      const data = format(new Date(atendimento.data_atendimento), 'dd/MM/yyyy', { locale: ptBR });
      dadosPorDia[data] = (dadosPorDia[data] || 0) + 1;
    });

    // Ordena as datas
    const datasOrdenadas = Object.keys(dadosPorDia).sort((a, b) => {
      const [diaA, mesA, anoA] = a.split('/');
      const [diaB, mesB, anoB] = b.split('/');
      return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
    });

    return {
      labels: datasOrdenadas,
      datasets: [
        {
          label: 'Atendimentos',
          data: datasOrdenadas.map(data => dadosPorDia[data]),
          backgroundColor: 'rgba(0, 82, 204, 0.8)',
          borderColor: 'rgba(0, 82, 204, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [dados]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default GraficoAtendimentosPorDia;
