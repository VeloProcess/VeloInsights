// api-large-files.js - Cliente para arquivos grandes (Vercel gratuito)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://veloinsights-api.vercel.app/api' 
  : 'http://localhost:3001/api';

class VeloinsightsAPILargeFiles {
  // Upload de arquivo (pequeno ou grande)
  static async uploadPlanilha(file) {
    const formData = new FormData();
    formData.append('planilha', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      // Se arquivo é grande, precisa processar separadamente
      if (result.processing === false && result.fileId) {
        return {
          ...result,
          needsProcessing: true
        };
      }
      
      return result;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  }

  // Processar arquivo grande em background
  static async processLargeFile(fileId) {
    try {
      const response = await fetch(`${API_BASE_URL}/process-large`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no processamento:', error);
      throw error;
    }
  }

  // Upload completo com processamento automático
  static async uploadAndProcess(file, onProgress = null) {
    try {
      // 1. Upload do arquivo
      if (onProgress) onProgress('Fazendo upload do arquivo...');
      const uploadResult = await this.uploadPlanilha(file);
      
      // 2. Se arquivo é pequeno, já está processado
      if (!uploadResult.needsProcessing) {
        if (onProgress) onProgress('Arquivo processado com sucesso!');
        return uploadResult;
      }
      
      // 3. Se arquivo é grande, processar em background
      if (onProgress) onProgress('Arquivo grande detectado. Processando em background...');
      
      // Aguardar um pouco antes de processar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const processResult = await this.processLargeFile(uploadResult.fileId);
      
      if (onProgress) onProgress('Arquivo grande processado com sucesso!');
      return processResult;
      
    } catch (error) {
      console.error('Erro no upload e processamento:', error);
      throw error;
    }
  }

  // Buscar dados salvos
  static async getDados() {
    try {
      const response = await fetch(`${API_BASE_URL}/dados`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return { atendimentos: [], operadores: [] };
    }
  }

  // Limpar dados
  static async limparDados() {
    try {
      const response = await fetch(`${API_BASE_URL}/dados`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Backend não disponível:', error);
      return { status: 'ERROR', message: 'Backend não disponível' };
    }
  }
}

export default VeloinsightsAPILargeFiles;
