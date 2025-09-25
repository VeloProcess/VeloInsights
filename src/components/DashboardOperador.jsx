// v2.0.0
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import CardIndicador from './CardIndicador';
import AtendimentoItem from './AtendimentoItem';
import GraficoAtendimentosPorDia from './GraficoAtendimentosPorDia';

function DashboardOperador() {
  const { dadosFiltradosOperador, operadorSelecionado } = useData();

  const metricasOperador = useMemo(() => {
    const totalAtendimentos = dadosFiltradosOperador.length;
    
    // Duração média em minutos
    const duracaoTotalSegundos = dadosFiltradosOperador.reduce((acc, d) => acc + d.duracao_segundos, 0);
    const duracaoMediaMinutos = totalAtendimentos > 0 ? Math.round(duracaoTotalSegundos / totalAtendimentos / 60) : 0;
    
    // Avaliações de atendimento
    const avaliacoesAtendimento = dadosFiltradosOperador.filter(d => d.avaliacao_atendimento !== null);
    const mediaAtendimento = avaliacoesAtendimento.length > 0 
      ? (avaliacoesAtendimento.reduce((acc, d) => acc + d.avaliacao_atendimento, 0) / avaliacoesAtendimento.length).toFixed(1)
      : 'N/A';
    
    // Avaliações de solução
    const avaliacoesSolucao = dadosFiltradosOperador.filter(d => d.avaliacao_solucao !== null);
    const mediaSolucao = avaliacoesSolucao.length > 0 
      ? (avaliacoesSolucao.reduce((acc, d) => acc + d.avaliacao_solucao, 0) / avaliacoesSolucao.length).toFixed(1)
      : 'N/A';
    
    // Duração total em horas
    const duracaoTotalHoras = Math.round(duracaoTotalSegundos / 3600 * 10) / 10;

    return {
      totalAtendimentos,
      duracaoMediaMinutos,
      duracaoTotalHoras,
      mediaAtendimento,
      mediaSolucao
    };
  }, [dadosFiltradosOperador]);

  // Ordena os atendimentos por data (mais recente primeiro)
  const atendimentosOrdenados = useMemo(() => {
    return [...dadosFiltradosOperador].sort((a, b) => 
      new Date(b.data_atendimento) - new Date(a.data_atendimento)
    );
  }, [dadosFiltradosOperador]);

  return (
    <div>
      <div className="dashboard-grid">
        <CardIndicador 
          titulo="Atendimentos do Operador" 
          valor={metricasOperador.totalAtendimentos} 
          descricao={`${operadorSelecionado}`}
        />
        <CardIndicador 
          titulo="Duração Média" 
          valor={`${metricasOperador.duracaoMediaMinutos} min`} 
          descricao="Tempo médio por atendimento"
        />
        <CardIndicador 
          titulo="Tempo Total" 
          valor={`${metricasOperador.duracaoTotalHoras} h`} 
          descricao="Tempo total de atendimento"
          cor="#6f42c1"
        />
        <CardIndicador 
          titulo="Avaliação Atendimento" 
          valor={metricasOperador.mediaAtendimento} 
          descricao="Nota média do atendente"
          cor="#28a745"
        />
        <CardIndicador 
          titulo="Avaliação Solução" 
          valor={metricasOperador.mediaSolucao} 
          descricao="Nota média da solução"
          cor="#17a2b8"
        />
      </div>
      
      <div className="velohub-card">
        <h3>Atendimentos por Dia - {operadorSelecionado}</h3>
        <GraficoAtendimentosPorDia dados={dadosFiltradosOperador} />
      </div>
      
      <div className="velohub-card">
        <h3>Lista de Atendimentos - {operadorSelecionado}</h3>
        <div>
          {atendimentosOrdenados.map(atendimento => (
            <AtendimentoItem 
              key={atendimento.id} 
              atendimento={atendimento} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardOperador;
