// v1.0.0 - Gerencia todo o estado da aplicação
import React, { createContext, useState, useContext, useMemo } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [rawData, setRawData] = useState([]);
    const [operadores, setOperadores] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [operadorSelecionado, setOperadorSelecionado] = useState('');

    const dadosFiltrados = useMemo(() => {
        const [inicio, fim] = dateRange;
        let data = rawData;

        if (inicio) {
            data = data.filter(d => new Date(d.data_atendimento) >= inicio);
        }
        if (fim) {
            // Inclui o dia final
            const endDate = new Date(fim);
            endDate.setHours(23, 59, 59, 999);
            data = data.filter(d => new Date(d.data_atendimento) <= endDate);
        }
        
        return data;
    }, [rawData, dateRange]);
    
    const dadosOperador = useMemo(() => {
        if (!operadorSelecionado) return [];
        return dadosFiltrados.filter(d => d.operador === operadorSelecionado);
    }, [dadosFiltrados, operadorSelecionado]);

    const value = {
        rawData, setRawData,
        operadores, setOperadores,
        dateRange, setDateRange,
        operadorSelecionado, setOperadorSelecionado,
        dadosFiltradosGeral: dadosFiltrados,
        dadosFiltradosOperador: dadosOperador,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
