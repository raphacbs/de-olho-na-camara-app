import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para acessar os dados do usuário logado.
 * Retorna o objeto do usuário e o status de autenticação.
 */
export function useUser() {
  const { user, isAuthenticated } = useAuth();
  return { user, isAuthenticated };
}
