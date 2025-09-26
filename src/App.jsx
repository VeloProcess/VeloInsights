import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>VeloInsights Dashboard</h1>
      <p>API funcionando corretamente!</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Status do Sistema:</h3>
        <ul>
          <li>✅ Frontend carregado</li>
          <li>✅ React funcionando</li>
          <li>✅ Vite build funcionando</li>
          <li>✅ Deploy no Vercel funcionando</li>
        </ul>
      </div>
    </div>
  );
}

export default App;