// useRoute shim
import { useRoute } from '@/navigation/routerShim';

// Hook para acessar dados passados durante a navegação
// Use um genérico P para descrever a forma de `params` da rota atual.
export function useNavigationData<P extends Record<string, any> = Record<string, any>>() {
  const route = useRoute();

  // Retorna os parâmetros passados na navegação, tipados como P
  const getRouteParams = (): P => {
    return (route.params ?? {}) as P;
  };

  // Função auxiliar para obter um parâmetro específico com tipagem baseada em P
  const getParam = <K extends keyof P>(key: K, defaultValue?: P[K]): P[K] | undefined => {
    const params = getRouteParams();
    return (params as P)[key] ?? defaultValue;
  };

  return {
    params: getRouteParams(),
    getParam,
    routeName: String((route as any).name ?? '')
  };
}
