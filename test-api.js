const API_URLS = {
  development: 'http://localhost:8080',
  staging: 'https://api-staging.fiscaliza.ai/api',
  production: 'https://api.fiscaliza.ai/api'
};

async function testConnection(url, environment) {
  console.log(`\n🌐 Testando conexão com ${environment}: ${url}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url + '/v1/auth/login', {
      method: 'OPTIONS', // Usar OPTIONS para testar conectividade sem fazer login real
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log(`✅ Conexão ${environment} OK - Status: ${response.status}`);

    return true;
  } catch (error) {
    console.log(`❌ Erro na conexão ${environment}:`, error.message);

    if (error.name === 'AbortError') {
      console.log(`⏱️ Timeout na conexão ${environment}`);
    } else if (error.message.includes('ENOTFOUND')) {
      console.log(`🔍 Host não encontrado para ${environment}`);
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log(`🚫 Conexão recusada para ${environment}`);
    } else if (error.message.includes('CERT_HAS_EXPIRED')) {
      console.log(`🔒 Certificado SSL expirado para ${environment}`);
    }

    return false;
  }
}

async function main() {
  console.log('🧪 Testando conectividade da API...\n');

  const results = {};

  for (const [env, url] of Object.entries(API_URLS)) {
    results[env] = await testConnection(url, env);
  }

  console.log('\n📊 Resumo dos testes:');
  Object.entries(results).forEach(([env, success]) => {
    console.log(`${success ? '✅' : '❌'} ${env}: ${success ? 'OK' : 'FALHA'}`);
  });

  console.log('\n💡 Recomendações:');
  if (!results.development) {
    console.log('- Para desenvolvimento: verifique se o servidor local está rodando na porta 8080');
    console.log('- Execute: npm run dev ou similar no backend');
  }
  if (!results.production) {
    console.log('- Para produção: verifique se a API está acessível publicamente');
    console.log('- Pode haver problemas de rede ou firewall');
  }
}

main().catch(console.error);
