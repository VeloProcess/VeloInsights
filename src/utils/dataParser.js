// v1.0.0 - Funções para processar os dados da planilha
import * as XLSX from 'xlsx';

// Converte HH:MM:SS para segundos
const hmsToSeconds = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const parts = timeStr.split(':');
    if (parts.length !== 3) return 0;
    const [hours, minutes, seconds] = parts.map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
};

// Combina Data e Hora
const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}T${timeStr}`);
};

export const processarPlanilha = (fileBuffer) => {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const atendimentos = [];
    const operadores = new Set();

    jsonData.forEach(row => {
        if (row['Chamada'] === 'Atendida' && row['Operador']) {
            atendimentos.push({
                operador: row['Operador'],
                data_atendimento: parseDateTime(row['Data Atendimento'], row['Hora Atendimento']),
                duracao_segundos: hmsToSeconds(row['Tempo Falado']),
                avaliacao_atendimento: parseInt(row['Pergunta2 1 PERGUNTA ATENDENTE']) || null,
                avaliacao_solucao: parseInt(row['Pergunta2 2 PERGUNTA SOLUCAO']) || null,
                id: row['Id Ligação'] || Math.random() // Garante um ID único
            });
            operadores.add(row['Operador']);
        }
    });
    
    // Ordena os operadores alfabeticamente
    const operadoresList = Array.from(operadores).sort();
    return { atendimentos, operadores: operadoresList };
};
