# Sistema de Autenticação

Este documento descreve a implementação completa do sistema de autenticação do aplicativo Fiscaliza AI Câmara Federal.

## 📁 Estrutura dos Arquivos

```
src/
├── contexts/
│   ├── AuthContext.tsx     # Contexto de autenticação principal
│   └── README.md          # Esta documentação
├── services/
│   ├── authService.ts     # Serviço de autenticação
│   └── apiClient.ts       # Cliente HTTP com suporte a tokens
├── screens/
│   ├── LoginScreen.tsx    # Tela de login/cadastro
│   └── SettingsScreen.tsx # Tela com botão de logout
├── navigation/
│   └── AppNavigator.tsx   # Navegação condicional
└── components/
    └── Input.tsx          # Componente de input customizado
```

## 🔐 Funcionalidades Implementadas

### Autenticação Completa
- ✅ **Login** com email e senha
- ✅ **Cadastro** de novos usuários
- ✅ **Logout** com confirmação
- ✅ **Refresh Token** automático
- ✅ **Persistência** de sessão (AsyncStorage)
- ✅ **Compatibilidade** com API BFF (accessToken, refreshToken, expireIn)

### Segurança
- ✅ **Token JWT** nas requisições HTTP
- ✅ **Validação** de formulários
- ✅ **Tratamento de erros** padronizado
- ✅ **Timeout** de sessão configurável

### UX/UI
- ✅ **Loading states** durante operações
- ✅ **Validação em tempo real** dos campos
- ✅ **Mensagens de erro** amigáveis
- ✅ **Navegação condicional** (login vs app)

## 🚀 Como Usar

### 1. Login Básico

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { login, logout, user, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
      // Login bem-sucedido - usuário será redirecionado automaticamente
    } catch (error) {
      // Tratar erro de login
    }
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>Bem-vindo, {user?.name}!</Text>
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}
```

### 2. Cadastro de Usuário

```typescript
const { register } = useAuth();

const handleRegister = async () => {
  try {
    await register({
      email: 'newuser@example.com',
      password: 'securepassword',
      fullName: 'Nome do Usuário'
    });
  } catch (error) {
    // Tratar erro de cadastro
  }
};
```

### 3. Logout

```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout(); // Usuário será deslogado e redirecionado para login
};
```

### 4. Verificar Estado de Autenticação

```typescript
const { isAuthenticated, isLoading, user } = useAuth();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!isAuthenticated) {
  return <LoginScreen />;
}

return <MainApp user={user} />;
```

## 🏗️ Arquitetura

### AuthContext
O contexto principal que gerencia o estado de autenticação:

- **Estado**: `user`, `token`, `isLoading`, `isAuthenticated`
- **Ações**: `login`, `register`, `logout`, `refreshToken`
- **Persistência**: AsyncStorage automático
- **Integração**: API client automático

### AuthService
Serviço que comunica com a API de autenticação:

- **Endpoints**: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/refresh`
- **Tratamento de erros**: Mapeamento padronizado
- **Retry logic**: Tentativas automáticas para erros de rede
- **Validação**: Verificação de respostas da API

### API Client Integration
O cliente HTTP foi modificado para incluir tokens automaticamente:

- **Header Authorization**: `Bearer {token}`
- **Interceptação**: Token adicionado em todas as requisições
- **Limpeza**: Token removido no logout
- **Refresh**: Atualização automática do token

## 🔧 Configuração

### Endpoints da API
Configure os endpoints no `authService.ts`:

```typescript
private readonly endpoints = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  profile: '/auth/profile',
};
```

### Persistência
Os dados são automaticamente salvos no AsyncStorage:

```typescript
const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';
```

### Timeout de Sessão
Configure no `authService.ts`:

```typescript
isTokenValid(token: string): boolean {
  // Verifica expiração do JWT
  const payload = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp > currentTime;
}
```

## 🎯 Estados da Aplicação

### Estados do AuthContext

```typescript
interface AuthState {
  user: User | null;           // Dados do usuário logado
  token: string | null;        // Token JWT atual
  isLoading: boolean;          // Operação em andamento
  isAuthenticated: boolean;    // Usuário está logado
}
```

### Fluxo de Estados

```
Não autenticado
    ↓ (login/register)
Carregando
    ↓ (sucesso)
Autenticado
    ↓ (logout/expiração)
Não autenticado
```

## 🔄 Tratamento de Erros

### Erros Comuns

| Código | Mensagem | Ação |
|--------|----------|------|
| `INVALID_CREDENTIALS` | Email ou senha incorretos | Tentar novamente |
| `USER_NOT_FOUND` | Usuário não encontrado | Verificar email |
| `EMAIL_ALREADY_EXISTS` | Email já cadastrado | Usar outro email |
| `WEAK_PASSWORD` | Senha muito fraca | Senha com 6+ caracteres |
| `NETWORK_ERROR` | Erro de conexão | Verificar internet |
| `TOKEN_EXPIRED` | Sessão expirada | Fazer login novamente |

### Tratamento Padronizado

```typescript
try {
  await login(credentials);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Erro desconhecido';
  // Mostrar mensagem para o usuário
  Alert.alert('Erro', message);
}
```

## 🧪 Testes

### Cenários para Testar

1. **Login válido** → Redirecionamento para app
2. **Login inválido** → Mensagem de erro
3. **Cadastro válido** → Login automático
4. **Cadastro com email existente** → Mensagem de erro
5. **Logout** → Redirecionamento para login
6. **Token expirado** → Logout automático
7. **Perda de conexão** → Estados apropriados

### Debug

```typescript
// Verificar estado atual
console.log('Auth State:', {
  isAuthenticated,
  user: user?.email,
  hasToken: !!token,
  isLoading
});
```

## 📋 Checklist de Implementação

- [x] Contexto de autenticação com estado global
- [x] Serviço de autenticação com API
- [x] Tela de login/cadastro com validação
- [x] Navegação condicional
- [x] Persistência com AsyncStorage
- [x] Integração com API client
- [x] Tratamento de erros completo
- [x] Logout com confirmação
- [x] Refresh token automático
- [x] Componentes de UI customizados
- [x] Documentação completa
- [x] Compatibilidade com formato da API BFF
- [x] Extração automática de dados do usuário via JWT

## 🔄 Formato da API BFF

O sistema foi implementado para ser compatível com o formato de resposta da API BFF:

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "JWT",
  "expireIn": 31
}
```

### Campos da Resposta:
- **accessToken**: Token JWT para autenticação de requisições
- **refreshToken**: Token para renovar o accessToken expirado
- **tokenType**: Tipo do token (sempre "JWT")
- **expireIn**: Tempo de expiração do token em segundos

### Extração de Dados do Usuário

Os dados do usuário são extraídos automaticamente do payload JWT:

```javascript
// Exemplo de payload JWT decodificado
{
  "sub": "admin@email.com",           // Email do usuário
  "userId": "7d017733-...",           // ID único do usuário
  "name": "Administrador",           // Nome (opcional)
  "iat": 1766932651,                 // Issued at
  "exp": 1766932911                  // Expiration time
}
```

## 🔒 Segurança

### Boas Práticas Implementadas

- **Nunca armazenar senha** em texto plano
- **Token JWT** com expiração
- **HTTPS obrigatório** em produção
- **Logout forçado** em token inválido
- **Limpeza de dados** sensíveis no logout
- **Validação de entrada** em todos os campos

### Recomendações Adicionais

- Implementar **biometria** (Face ID/Touch ID)
- Adicionar **2FA** (autenticação de dois fatores)
- Configurar **rate limiting** na API
- Implementar **logs de segurança**
- Usar **certificado SSL** válido

## 📚 Referências

- [AsyncStorage - React Native](https://reactnative.dev/docs/asyncstorage)
- [JWT.io - JSON Web Tokens](https://jwt.io/)
- [OWASP Authentication Cheat Sheet](https://owasp.org/www-project-cheat-sheets/cheatsheets/Authentication_Cheat_Sheet.html)
