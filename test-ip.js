// Script simples para testar a detecção de IP
console.log('Testando detecção de IP...');

// Simular as condições de desenvolvimento
process.env.NODE_ENV = 'development';

async function testIPDetection() {
  try {
    // Importar a função de detecção
    const { getApiConfig } = require('./src/config/api.ts');

    console.log('Chamando getApiConfig...');
    const config = getApiConfig();

    console.log('Configuração obtida:', {
      baseURL: config.baseURL,
      environment: 'development'
    });

  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testIPDetection();