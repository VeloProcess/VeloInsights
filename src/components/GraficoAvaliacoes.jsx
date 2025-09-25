import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function GraficoAvaliacoes({ dados }) {
  const chartData = useMemo(() => {
    // Conta as avaliações de atendimento
    const avaliacoesAtendimento = dados.filter(d => d.avaliacao_atendimento !== null);
    
    const contagem = {
      'Excelente (4-5)': 0,
      'Bom (3)': 0,
      'Regular (2)': 0,
      'Ruim (1)': 0,
      'Não Avaliado': 0
    };

    avaliacoesAtendimento.forEach(d => {
      if (d.avaliacao_atendimento >= 4) {
        contagem['Excelente (4-5)']++;
      } else if (d.avaliacao_atendimento === 3) {
        contagem['Bom (3)']++;
      } else if (d.avaliacao_atendimento === 2) {
        contagem['Regular (2)']++;
      } else if (d.avaliacao_atendimento === 1) {
        contagem['Ruim (1)']++;
      }
    });

    // Adiciona os não avaliados
    contagem['Não Avaliado'] = dados.length - avaliacoesAtendimento.length;

    const labels = Object.keys(contagem).filter(label => contagem[label] > 0);
    const values = labels.map(label => contagem[label]);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            'rgba(40, 167, 69, 0.8)',   // Verde para Excelente
            'rgba(23, 162, 184, 0.8)',  // Azul para Bom
            'rgba(255, 193, 7, 0.8)',  // Amarelo para Regular
            'rgba(220, 53, 69, 0.8)',  // Vermelho para Ruim
            'rgba(108, 117, 125, 0.8)', // Cinza para Não Avaliado
          ],
          borderColor: [
            'rgba(40, 167, 69, 1)',
            'rgba(23, 162, 184, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(220, 53, 69, 1)',
            'rgba(108, 117, 125, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [dados]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
  };

  return <Pie data={chartData} options={options} />;
}

export default GraficoAvaliacoes;
