#!/usr/bin/env node

/**
 * Script que detecta automaticamente o IP local da máquina
 * e atualiza o .env.local para conectar ao backend
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let firstIp = null;

  for (const name of Object.keys(interfaces)) {
    // Pula interfaces virtuais, loopback e docker
    if (
      name.toLowerCase().includes('docker') ||
      name.toLowerCase().includes('vbox') ||
      name.toLowerCase().includes('virtual') ||
      name.toLowerCase().includes('vethernet') // Para WSL, Hyper-V
    ) {
      continue;
    }

    for (const iface of interfaces[name]) {
      // Procura por IPv4 não interno
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prioriza interfaces Wi-Fi, que são mais comuns para desenvolvimento com Expo Go
        if (name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wireless')) {
          return iface.address; // Encontrou Wi-Fi, retorna imediatamente.
        }

        // Guarda o primeiro IP encontrado (geralmente Ethernet) como fallback
        if (!firstIp) {
          firstIp = iface.address;
        }
      }
    }
  }

  // Se não encontrou Wi-Fi, usa o primeiro IP que encontrou.
  return firstIp || 'localhost';
}

function updateEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const ip = getLocalIP();
  const port = '8080';

  const envContent = `# ⚠️ GERADO AUTOMATICAMENTE - NÃO EDITAR MANUALMENTE
# Script: scripts/setup-env.js
# Último update: ${new Date().toLocaleString('pt-BR')}
#
# Detecção automática de IP:
# - Emulador Android: 10.0.2.2 (será usado automaticamente)
# - Dispositivo físico/Expo Go: IP detectado
# - Web/localhost: localhost

EXPO_PUBLIC_API_IP=${ip}
EXPO_PUBLIC_API_PORT=${port}
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_MOCK_ENABLED=true
`;

  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`✅ .env.local atualizado com IP: ${ip}`);
    console.log(`📝 Arquivo: ${envPath}`);
  } catch (error) {
    console.error('❌ Erro ao atualizar .env.local:', error.message);
    process.exit(1);
  }
}

// Executar quando chamado diretamente
if (require.main === module) {
  updateEnvFile();
}

module.exports = { getLocalIP, updateEnvFile };
