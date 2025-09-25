import React from 'react';

function CardIndicador({ titulo, valor, descricao, cor = 'var(--cor-primaria)' }) {
  return (
    <div className="card-indicador">
      <h3 style={{ color: cor }}>{titulo}</h3>
      <div className="valor">{valor}</div>
      <div className="descricao">{descricao}</div>
    </div>
  );
}

export default CardIndicador;
