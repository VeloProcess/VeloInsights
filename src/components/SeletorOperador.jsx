// v2.0.0
import React from 'react';
import { useData } from '../context/DataContext';

function SeletorOperador() {
  const { operadores, operadorSelecionado, setOperadorSelecionado } = useData();

  return (
    <div className="filtro-container">
      <label htmlFor="operador-select">Selecione um Operador:</label>
      <select
        id="operador-select"
        value={operadorSelecionado}
        onChange={(e) => setOperadorSelecionado(e.target.value)}
        className="seletor-operador"
      >
        <option value="">-- Selecione um operador --</option>
        {operadores.map(operador => (
          <option key={operador} value={operador}>
            {operador}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SeletorOperador;
