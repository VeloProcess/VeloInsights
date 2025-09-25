import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function AtendimentoItem({ atendimento }) {
  const [expandido, setExpandido] = useState(false);

  const formatarData = (data) => {
    return format(new Date(data), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const formatarDuracao = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
      return `${horas}h ${minutos}m ${segs}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${segs}s`;
    } else {
      return `${segs}s`;
    }
  };

  const getAvaliacaoClass = (nota) => {
    if (nota >= 4) return 'excelente';
    if (nota >= 3) return 'bom';
    if (nota >= 2) return 'regular';
    return 'ruim';
  };

  const getAvaliacaoTexto = (nota) => {
    if (nota >= 4) return 'Excelente';
    if (nota >= 3) return 'Bom';
    if (nota >= 2) return 'Regular';
    return 'Ruim';
  };

  return (
    <div className="velohub-card" style={{ marginBottom: '0.5rem' }}>
      <div 
        className="atendimento-header"
        onClick={() => setExpandido(!expandido)}
      >
        <div>
          <strong>{formatarData(atendimento.data_atendimento)}</strong>
          <span style={{ marginLeft: '1rem', color: 'var(--texto-secundario-escuro)' }}>
            {formatarDuracao(atendimento.duracao_segundos)}
          </span>
        </div>
        <button className="expand-button">
          {expandido ? '−' : '+'}
        </button>
      </div>
      
      {expandido && (
        <div className="atendimento-details">
          <div className="atendimento-info">
            <div className="info-item">
              <div className="info-label">Operador</div>
              <div className="info-value">{atendimento.operador}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Data/Hora</div>
              <div className="info-value">{formatarData(atendimento.data_atendimento)}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Duração</div>
              <div className="info-value">{formatarDuracao(atendimento.duracao_segundos)}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Avaliação Atendimento</div>
              <div className="info-value">
                {atendimento.avaliacao_atendimento ? (
                  <span className={`avaliacao ${getAvaliacaoClass(atendimento.avaliacao_atendimento)}`}>
                    {atendimento.avaliacao_atendimento} - {getAvaliacaoTexto(atendimento.avaliacao_atendimento)}
                  </span>
                ) : (
                  <span style={{ color: 'var(--texto-secundario-escuro)' }}>Não avaliado</span>
                )}
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Avaliação Solução</div>
              <div className="info-value">
                {atendimento.avaliacao_solucao ? (
                  <span className={`avaliacao ${getAvaliacaoClass(atendimento.avaliacao_solucao)}`}>
                    {atendimento.avaliacao_solucao} - {getAvaliacaoTexto(atendimento.avaliacao_solucao)}
                  </span>
                ) : (
                  <span style={{ color: 'var(--texto-secundario-escuro)' }}>Não avaliado</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AtendimentoItem;
