Plano curto / checklist
- [x] Investigar o fluxo de login biométrico (ler arquivos relevantes).
- [x] Implementar comportamento resiliente no auto-login por biometria: mascarar senha nos logs, detectar falha por credenciais inválidas e remover credenciais biométricas salvas para evitar tentativas repetidas.
- [x] Rodar checagem de tipos/TS para garantir que não quebre o build.
- [x] Instruir como reproduzir e validar a correção e próximos passos recomendados.

O que encontrei
- O fluxo de auto-login biométrico fica em `src/contexts/AuthContext.tsx`. Ele:
  - verifica se biometria está habilitada/suportada,
  - chama `biometricsService.authenticateBiometric()` e `getSavedCredentials()`,
  - e invoca `login({ email, password })`.
- A requisição de login passa por `src/services/authService.ts` que usa `apiClient` (axios) para chamar a API. Quando a API responde com erro, `apiClient` constrói um erro com a mensagem do backend e `authService.handleAuthError` pode mapear códigos para mensagens legíveis.
- O log original mostrou: "❌ Erro durante o login no AuthContext: [Error: Senha inválida]" — indica credenciais inválidas na resposta da API.

Alterações aplicadas
- Arquivo editado: `src/contexts/AuthContext.tsx`.
- Resumo das mudanças:
  - No efeito que executa o auto-login biométrico, envolvi a chamada a `login(...)` em um try/catch adicional.
  - Passei a mascarar a senha nos logs (mostrar apenas asteriscos limitados) — para depuração sem vazar a senha.
  - Se a tentativa de login falhar, analiso a mensagem do erro com heurística (palavras como 'senha', 'invalid', 'credentials', 'Email ou senha', 'INVALID_CREDENTIALS', etc.). Se detectado como falha por credenciais inválidas, removo as credenciais biométricas salvas chamando `biometricsService.removeCredentials()` para evitar tentativas repetidas que sempre falharão.
  - O fluxo de auto-login agora falha silenciosamente após cleanup (não relança o erro), evitando logout ou efeitos colaterais indesejados.
- Racional:
  - Se o usuário mudou a senha no servidor, o app não deve tentar sempre autenticar com a senha antiga salva e gerar ruído de erro. Removendo as credenciais biométricas inválidas, o usuário pode fazer login manual com a nova senha e reativar biometria.
  - Mascarar a senha evita expor a senha em logs.

Testes executados
- Rodei checagem de tipos TypeScript (tsc --noEmit). Comandos executados:
  - `npm run typecheck`
  - `./node_modules/.bin/tsc --noEmit`
- Resultado: não foram detectados erros de tipo relacionados às mudanças realizadas no arquivo.
- Corrigi um warning do linter/checador que apontava "throw of exception caught locally" removendo o re-throw no fluxo de auto-login biométrico.

Como validar localmente
1. Inicie o app no dispositivo/emulador (Expo):
   - `npm run start` ou `npm run android`
2. Habilite biometria no app (se ainda não estiver).
3. Simule um caso onde as credenciais salvas são inválidas:
   - A: altere a senha no backend para que a senha salva passe a ser inválida, então abra o app — o auto-login deverá falhar.
   - B: force manualmente a chamada de `login` no caminho biométrico com credenciais erradas (apenas para teste).
4. Observe os logs:
   - Deve aparecer algo como: "Attempting biometric auto-login for user@example.com password: *****"
   - Se a API responder com erro de credenciais, verá um warning indicando que credenciais biométricas inválidas foram detectadas e removidas.
5. Confirmar que as credenciais biométricas foram removidas: `biometricsService.getSavedCredentials()` deve retornar null.

Comportamento esperado após a correção
- Em caso de senha/credenciais inválidas no auto-login biométrico:
  - O app registra o evento (com senha mascarada),
  - Remove as credenciais biométricas armazenadas,
  - Falha silenciosamente o auto-login (sem forçar logout nem causar loop),
  - O usuário poderá fazer login manualmente com a nova senha e reativar biometria.

Próximos passos recomendados (opcionais)
- UX: apresentar um modal amigável informando que a biometria foi desativada porque as credenciais salvas estão desatualizadas, com opção para reconfigurar.
- Telemetria: registrar evento analítico quando remoção automática ocorrer.
- Afinar heurística: preferir usar `code` padronizado retornado pela API se disponível, em vez de análise textual.
- Testes: adicionar testes unitários que simulem falha de login no fluxo biométrico e verifiquem remoção de credenciais.

Status da entrega
- Mudanças aplicadas em `src/contexts/AuthContext.tsx`.
- Arquivo salvo como `plan-biometricAutoLoginFix.prompt.md` para refinamento posterior.

