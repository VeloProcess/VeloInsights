// v2.0.0
import React from 'react';
import { useData } from './context/DataContext';
import Uploader from './components/Uploader';
import Header from './components/Header';
import DashboardGeral from './components/DashboardGeral';
import SeletorOperador from './components/SeletorOperador';
import DashboardOperador from './components/DashboardOperador';
import FiltroData from './components/FiltroData';

function App() {
  const { rawData, operadorSelecionado } = useData();

  if (rawData.length === 0) {
    return <Uploader />; // Mostra a tela de upload se não houver dados
  }

  return (
    <div>
      <Header />
      <main>
        <FiltroData />
        <hr style={{ margin: '0 0 2rem 0', border: 'none', borderTop: '1px solid var(--cor-borda)' }}/>
        <section>
          <h2>Dashboard Geral da Operação</h2>
          <DashboardGeral />
        </section>
        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--cor-borda)' }}/>
        <section>
          <h2>Análise Individual do Operador</h2>
          <SeletorOperador />
          {operadorSelecionado && <DashboardOperador />}
        </section>
      </main>
    </div>
  );
}
export default App;
