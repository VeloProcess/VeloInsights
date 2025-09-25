// v2.0.0
import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useData } from '../context/DataContext';

registerLocale('pt-BR', ptBR);

function FiltroData() {
  const { dateRange, setDateRange } = useData();
  const [inicio, fim] = dateRange;

  return (
    <div className="filtro-container">
      <label htmlFor="data-inicio">Data Início:</label>
      <DatePicker
        id="data-inicio"
        selected={inicio}
        onChange={(date) => setDateRange([date, fim])}
        selectsStart
        startDate={inicio}
        endDate={fim}
        locale="pt-BR"
        dateFormat="dd/MM/yyyy"
        placeholderText="Selecione a data inicial"
        className="date-picker-input"
      />
      
      <label htmlFor="data-fim">Data Fim:</label>
      <DatePicker
        id="data-fim"
        selected={fim}
        onChange={(date) => setDateRange([inicio, date])}
        selectsEnd
        startDate={inicio}
        endDate={fim}
        minDate={inicio}
        locale="pt-BR"
        dateFormat="dd/MM/yyyy"
        placeholderText="Selecione a data final"
        className="date-picker-input"
      />
      
      <button 
        onClick={() => setDateRange([null, null])}
        className="velohub-btn"
      >
        Limpar Filtros
      </button>
    </div>
  );
}

export default FiltroData;
