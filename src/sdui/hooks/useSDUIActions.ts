import { useCallback } from 'react';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@/navigation/routerShim';
import { RootTabParamList } from '@/types/navigation';
import { useScreenParams } from '../ScreenParamsContext';


// Armazenamento temporário para dados entre telas (genérico)
const navigationDataStore: Record<string, unknown> = {};

export function useSDUIActions() {
  const navigation = useNavigation();
  const { updateScreenParams } = useScreenParams();

  // Função para armazenar dados que podem ser acessados em outra tela (genérico)
  const storeNavigationData = <T = unknown>(key: string, data: T): void => {
    navigationDataStore[key] = data;
  };

  // Função para recuperar dados armazenados (genérico, retorna T | undefined)
  const getNavigationData = <T = unknown>(key: string): T | undefined => {
    const data = navigationDataStore[key] as T | undefined;
    // Opcional: limpar os dados após recuperar
    delete navigationDataStore[key];
    return data;
  };

  const handleAction = (actionId: string, params?: Record<string, unknown>) => {
    console.log('SDUI Action triggered:', actionId, params);

    switch (actionId) {
      case 'navigate_propositions':
        navigation.navigate('Proposições', params as RootTabParamList['Proposições']);
        break;

      case 'navigate_home':
        navigation.navigate('Home');
        break;

      case 'navigate_deputados':
        navigation.navigate('Deputados', params as RootTabParamList['Deputados']);
        break;

      case 'navigate_votacoes':
        navigation.navigate('Votações');
        break;

      case 'navigate_configuracoes':
        navigation.navigate('Configurações');
        break;

      // Ações específicas com dados
      case 'open_proposition_detail':
        if (params?.propositionId && typeof params.propositionId === 'string') {
          // Armazenar dados da proposição para uso na tela de destino
          storeNavigationData(`proposition_${params.propositionId}`, params);
          navigation.navigate('Proposições', {
            propositionId: params.propositionId,
            ...params
          } as RootTabParamList['Proposições']);
        } else {
          navigation.navigate('Proposições', undefined);
        }
        break;

      case 'open_deputy_detail':
        if (params?.deputyId && typeof params.deputyId === 'string') {
          storeNavigationData(`deputy_${params.deputyId}`, params);
          navigation.navigate('Deputados', {
            deputyId: params.deputyId,
            ...params
          } as RootTabParamList['Deputados']);
        } else {
          navigation.navigate('Deputados', undefined);
        }
        break;

      // Ações genéricas de navegação com parâmetros
      case 'navigate_with_params':
        if (params?.screen && typeof params.screen === 'string') {
          const screenName = params.screen as keyof RootTabParamList;

          switch (screenName) {
            case 'Home':
              navigation.navigate('Home');
              break;
            case 'Deputados':
              navigation.navigate('Deputados', params.params as RootTabParamList['Deputados']);
              break;
            case 'Proposições':
              navigation.navigate('Proposições', params.params as RootTabParamList['Proposições']);
              break;
            case 'Votações':
              navigation.navigate('Votações');
              break;
            case 'Configurações':
              navigation.navigate('Configurações');
              break;
            default:
              console.warn('Unknown screen:', screenName);
          }
        }
        break;

      // Ação customizada que pode ser expandida
      case 'custom_action':
        if (params?.action && typeof params.action === 'string') {
          // Aqui você pode implementar lógica customizada
          console.log('Custom action:', params.action, params);
          // Exemplo: dispatch de uma action do Redux, chamada de API, etc.
        }
        break;
        
      // NOVO CASE: APLICAR FILTROS (OPÇÃO B: Recarregar tela atual com filtros)
      case 'apply_filters':
      case 'apply_proposition_filters': {
        console.log('Filtros recebidos:', params?.filters);
        console.log('Termo de busca:', params?.search);

        // Identificar a tela atual baseada na rota atual ou usar a tela alvo especificada
        const targetScreen = params?.targetScreen as string;
        const currentRoute = navigation.getState().routes[navigation.getState().index];
        const currentScreenName = currentRoute?.name;

        // Mapear nomes de tela para IDs de tela no contexto
        const screenIdMap: Record<string, string> = {
          'Proposições': 'propositions',
          'Deputados': 'politicians',
          'Votações': 'votings',
          'Home': 'home',
          'proposicoes': 'propositions', // Para compatibilidade com targetScreen
        };

        // Usar tela alvo se especificada, senão usar tela atual
        const targetScreenName = targetScreen ? screenIdMap[targetScreen] || targetScreen : currentScreenName;
        const screenId = screenIdMap[targetScreenName] || targetScreenName;

        if (screenId) {
          // Atualizar parâmetros da tela alvo - isso vai acionar recarregamento automático
          updateScreenParams(screenId, {
            search: params?.search as string,
            filters: params?.filters as Record<string, string[]>,
          });
          console.log(`Aplicando filtros na tela ${screenId}:`, {
            search: params?.search,
            filters: params?.filters
          });

          // Se a tela alvo for diferente da atual, navegar para ela
          if (targetScreen && targetScreen !== currentScreenName) {
            const navigationTarget = targetScreen === 'proposicoes' ? 'Proposições' : targetScreen;
            navigation.navigate(navigationTarget as keyof RootTabParamList);
          }
        } else {
          console.warn('Não foi possível identificar a tela alvo para aplicar filtros:', targetScreen || currentScreenName);
        }
        break;
      }

      default:
        console.warn('Unknown SDUI action:', actionId, params);
    }
  };

  return {
    handleAction,
    storeNavigationData,
    getNavigationData
  } as const;
}
