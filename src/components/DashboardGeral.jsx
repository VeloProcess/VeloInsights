// v2.0.0
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import CardIndicador from './CardIndicador';
import GraficoAtendimentosPorDia from './GraficoAtendimentosPorDia';
import GraficoAvaliacoes from './GraficoAvaliacoes';

function DashboardGeral() {
  const { dadosFiltradosGeral } = useData();

  const metricas = useMemo(() => {
    const totalAtendimentos = dadosFiltradosGeral.length;
    
    // Duração média em minutos
    const duracaoTotalSegundos = dadosFiltradosGeral.reduce((acc, d) => acc + d.duracao_segundos, 0);
    const duracaoMediaMinutos = totalAtendimentos > 0 ? Math.round(duracaoTotalSegundos / totalAtendimentos / 60) : 0;
    
    // Avaliações de atendimento
    const avaliacoesAtendimento = dadosFiltradosGeral.filter(d => d.avaliacao_atendimento !== null);
    const mediaAtendimento = avaliacoesAtendimento.length > 0 
      ? (avaliacoesAtendimento.reduce((acc, d) => acc + d.avaliacao_atendimento, 0) / avaliacoesAtendimento.length).toFixed(1)
      : 'N/A';
    
    // Avaliações de solução
    const avaliacoesSolucao = dadosFiltradosGeral.filter(d => d.avaliacao_solucao !== null);
    const mediaSolucao = avaliacoesSolucao.length > 0 
      ? (avaliacoesSolucao.reduce((acc, d) => acc + d.avaliacao_solucao, 0) / avaliacoesSolucao.length).toFixed(1)
      : 'N/A';
    
    // Operadores únicos
    const operadoresUnicos = new Set(dadosFiltradosGeral.map(d => d.operador)).size;
    
    // Atendimentos por período (considerando horário de funcionamento 8:00-19:00)
    const atendimentosPeriodo = dadosFiltradosGeral.filter(d => {
      const hora = new Date(d.data_atendimento).getHours();
      return hora >= 8 && hora < 19;
    }).length;

    return {
      totalAtendimentos,
      duracaoMediaMinutos,
      mediaAtendimento,
      mediaSolucao,
      operadoresUnicos,
      atendimentosPeriodo
    };
  }, [dadosFiltradosGeral]);

  return (
    <div>
      <div className="dashboard-grid">
        <CardIndicador 
          titulo="Total de Atendimentos" 
          valor={metricas.totalAtendimentos} 
          descricao="Chamadas atendidas no período"
        />
        <CardIndicador 
          titulo="Duração Média" 
          valor={`${metricas.duracaoMediaMinutos} min`} 
          descricao="Tempo médio por atendimento"
        />
        <CardIndicador 
          titulo="Avaliação Atendimento" 
          valor={metricas.mediaAtendimento} 
          descricao="Nota média do atendente"
          cor="#28a745"
        />
        <CardIndicador 
          titulo="Avaliação Solução" 
          valor={metricas.mediaSolucao} 
          descricao="Nota média da solução"
          cor="#17a2b8"
        />
        <CardIndicador 
          titulo="Operadores Ativos" 
          valor={metricas.operadoresUnicos} 
          descricao="Número de operadores únicos"
        />
        <CardIndicador 
          titulo="Atendimentos Período" 
          valor={metricas.atendimentosPeriodo} 
          descricao="Atendimentos das 8h às 19h"
          cor="#ffc107"
        />
      </div>
      
      <div className="velohub-card">
        <h3>Atendimentos por Dia</h3>
        <GraficoAtendimentosPorDia dados={dadosFiltradosGeral} />
      </div>
      
      <div className="velohub-card">
        <h3>Distribuição das Avaliações</h3>
        <GraficoAvaliacoes dados={dadosFiltradosGeral} />
      </div>
    </div>
  );
}

export default DashboardGeral;
