/**
 * Override para forçar configuração de desenvolvimento
 * Use isso apenas para testes/debug
 *
 * Para ativar: importe este arquivo no início do App.tsx
 */

// Sobrescrever __DEV__ se necessário
if (typeof __DEV__ === 'undefined') {
  (global as any).__DEV__ = true;
}

// Forçar variáveis de ambiente
process.env.FORCE_DEV_API = 'true';
process.env.EXPO_PUBLIC_ENV = 'development';

// Se quiser usar localhost em vez do IP do emulador, descomente a linha abaixo:
// process.env.FORCE_LOCALHOST = 'true';

console.log('🔧 Dev override ativado - forçando modo desenvolvimento');
console.log('💡 Para usar localhost em vez de IP do emulador, defina FORCE_LOCALHOST=true');
