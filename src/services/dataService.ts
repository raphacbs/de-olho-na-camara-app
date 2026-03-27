import apiClient from './apiClient';
import {
  PaginationResponse,
  PoliticianDto,
  ExpenseResponseDTO,
  PoliticianVoteDto,
  SpeechDto,
  PropositionDto,
  PresenceDto,
  PoliticianVoteWithPropositionDTO,
  VotingWithVotesDTO,
  DeviceRequest,
  SyncResponse,
  PartyDto,
  DashboardStatsDto,
  MetricData
} from '@/types/api';
import { HomeScreenBFFResponse } from '@/types/sdui';

const isMocked = process.env.EXPO_PUBLIC_MOCK_ENABLED === 'true';

/** Mock SDUI home screen returned when EXPO_PUBLIC_MOCK_ENABLED=true. */
const mockSDUIHomeScreen: HomeScreenBFFResponse = {
  screenId: 'home',
  version: '1.0',
  components: [
    {
      id: 'year-selector-banner',
      type: 'YEAR_SELECTOR_BANNER',
      properties: {
        title: 'Dados exibidos referentes ao ano selecionado',
        subtitle: 'Altere o ano para filtrar todas as consultas',
        selectedYear: new Date().getFullYear(),
        buttonBackgroundColor: '#D32F2F',
      },
    },
    {
      id: 'greeting-header',
      type: 'GREETING_HEADER',
      properties: {
        greeting: 'Olá, Visitante 👋',
        subtitle: 'Acompanhe a atividade dos deputados federais',
      },
    },
    {
      id: 'stats-grid',
      type: 'STATS_GRID',
      properties: {
        columns: 2,
        items: [
          {
            id: 'active-politicians',
            icon: 'people_outline',
            value: '513',
            label: 'Deputados Ativos',
            backgroundColor: '#1565C0',
            action: { type: 'NAVIGATE', route: '/politicians' },
          },
          {
            id: 'following',
            icon: 'star_outline',
            value: '12',
            label: 'Seguindo',
            backgroundColor: '#F57C00',
            action: { type: 'NAVIGATE', route: '/followed' },
          },
          {
            id: 'propositions',
            icon: 'description_outline',
            value: '23456',
            label: 'Proposições',
            backgroundColor: '#2E7D32',
            action: { type: 'NAVIGATE', route: '/propositions' },
          },
          {
            id: 'monthly-expenses',
            icon: 'attach_money',
            value: 'R$ 123M',
            label: 'Despesas do Mês',
            backgroundColor: '#C62828',
            action: { type: 'NAVIGATE', route: '/expenses' },
          },
        ],
      },
    },
    {
      id: 'quick-access-grid',
      type: 'QUICK_ACCESS_GRID',
      properties: {
        title: 'Acesso Rápido',
        columns: 2,
        items: [
          {
            id: 'propositions-quick',
            icon: 'description',
            label: 'Proposições',
            action: { type: 'NAVIGATE', route: '/propositions' },
          },
          {
            id: 'votacoes-quick',
            icon: 'how_to_vote',
            label: 'Votações',
            action: { type: 'NAVIGATE', route: '/votings' },
          },
          {
            id: 'deputados-quick',
            icon: 'people',
            label: 'Deputados',
            action: { type: 'NAVIGATE', route: '/politicians' },
          },
          {
            id: 'configuracoes-quick',
            icon: 'settings',
            label: 'Configurações',
            action: { type: 'NAVIGATE', route: '/expenses' },
          },
        ],
      },
    },
    {
      id: 'followed-section-header',
      type: 'SECTION_HEADER_WITH_BADGE',
      properties: {
        title: 'Deputados Seguidos',
        badgeCount: 12,
        badgeBackgroundColor: '#E65100',
        action: { type: 'NAVIGATE', route: '/followed' },
      },
    },
  ],
};

class DataService {

  // ─── SDUI ──────────────────────────────────────────────────────────────────

  /**
   * Generic SDUI screen fetcher.
   *
   * Calls any BFF SDUI endpoint and returns the raw response.
   * This is the single generic method the rendering engine uses — new SDUI
   * screens on the BFF side only need a call to this method with their
   * endpoint, no additional service code required.
   *
   * @param endpoint  - BFF endpoint path, e.g. '/api/v1/sdui/home'
   * @param params    - Optional query params forwarded to the BFF
   */
  async getSDUIScreen(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<HomeScreenBFFResponse> {
    const response = await apiClient.get<HomeScreenBFFResponse>(endpoint, params);
    return response.data;
  }

  /** Fetch the SDUI definition of the home screen from the BFF. */
  async getSDUIHomeScreen(year?: number | null): Promise<HomeScreenBFFResponse> {
    if (isMocked) {
      return mockSDUIHomeScreen;
    }
    const params = year ? { ano: year } : undefined;
    return this.getSDUIScreen('/api/v1/sdui/home', params);
  }

  // ─── Home Metrics ──────────────────────────────────────────────────────────

  // Home Metrics
  async getHomeMetrics(year?: number | null): Promise<MetricData[]> {
    if (isMocked) {
      // Retorna dados mockados (pode variar por ano se necessário)
      return [
        { key: 'activeDeputies', value: 513 },
        { key: 'following', value: 12 },
        { key: 'proposals', value: 23456 },
        { key: 'expenses', value: 'R$ 123M' },
      ];
    }

    const params = year ? { year } : undefined;
    const response = await apiClient.get<DashboardStatsDto>('/api/v1/dashboard/stats', params);
    const stats = response.data;

    return [
      { key: 'activeDeputies', value: stats.totalPoliticians },
      { key: 'following', value: stats.totalFollowing },
      { key: 'proposals', value: stats.totalPropositions },
      { key: 'expenses', value: stats.totalExpenses },
    ];
  }

  // Politicians
  async getPoliticians(params: { page?: number; size?: number; name?: string; party?: string; state?: string; isFollowed?: boolean }): Promise<PaginationResponse<PoliticianDto>> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<PaginationResponse<PoliticianDto>>('/api/v1/politicians', filteredParams);
    return response.data;
  }

  async getPoliticianById(id: number): Promise<PoliticianDto> {
    const response = await apiClient.get<PoliticianDto>(`/api/v1/politicians/${id}`);
    return response.data;
  }

  // Followed
  async getFollowedPoliticians(params: { page?: number; size?: number; name?: string; party?: string[]; state?: string[] }): Promise<PaginationResponse<PoliticianDto>> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries({ ...mergedParams, isFollowed: true }).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<PaginationResponse<PoliticianDto>>('/api/v1/politicians', filteredParams);
    return response.data;
  }

  async followPolitician(politicianId: number): Promise<void> {
    await apiClient.post(`/api/v1/followed/${politicianId}`);
  }

  async unfollowPolitician(politicianId: number): Promise<void> {
    await apiClient.delete(`/api/v1/followed/${politicianId}`);
  }

  // Expenses
  async getPoliticianExpenses(id: number, params: { page?: number; size?: number; year?: number; month?: number }): Promise<ExpenseResponseDTO> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<ExpenseResponseDTO>(`/api/v1/politicians/${id}/expenses`, filteredParams);
    return response.data;
  }

  // Votes
  async getPoliticianVotes(id: number, params: { page?: number; size?: number }): Promise<PaginationResponse<PoliticianVoteDto>> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<PaginationResponse<PoliticianVoteDto>>(`/api/v1/politicians/${id}/votes`, filteredParams);
    return response.data;
  }

  async getPoliticianVotesWithProposition(id: number, params: { page?: number; size?: number }): Promise<PaginationResponse<PoliticianVoteWithPropositionDTO>> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<PaginationResponse<PoliticianVoteWithPropositionDTO>>(`/api/v1/politicians/${id}/votes`, filteredParams);
    return response.data;
  }

  async getVotingsWithVotes(params: { page?: number; size?: number }): Promise<PaginationResponse<VotingWithVotesDTO>> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<PaginationResponse<VotingWithVotesDTO>>('/api/v1/votings-with-votes', filteredParams);
    return response.data;
  }

  // Speeches
  async getPoliticianSpeeches(id: number, params: { page?: number; size?: number }): Promise<PaginationResponse<SpeechDto>> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<PaginationResponse<SpeechDto>>(`/api/v1/politicians/${id}/speeches`, filteredParams);
    return response.data;
  }

  // Propositions
  async getPropositions(params: {
    page?: number;
    size?: number;
    politicianId?: number;
    types?: string[];
    statuses?: string[];
    startDate?: string;
    endDate?: string;
  }): Promise<PaginationResponse<PropositionDto>> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<PaginationResponse<PropositionDto>>('/api/v1/propositions', filteredParams);
    return response.data;
  }

  async getPoliticianPropositions(id: number, params: { page?: number; size?: number; year?: number }): Promise<PaginationResponse<PropositionDto>> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<PaginationResponse<PropositionDto>>(`/api/v1/politicians/${id}/propositions`, filteredParams);
    return response.data;
  }

  // Presence
  async getPoliticianPresence(id: number, params: { page?: number; size?: number }): Promise<PaginationResponse<PresenceDto>> {
    const defaultParams = { page: 0, size: 10 };
    const mergedParams = { ...defaultParams, ...params };
    const filteredParams = Object.fromEntries(
      Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === ''))
    );
    const response = await apiClient.get<PaginationResponse<PresenceDto>>(`/api/v1/politicians/${id}/presence`, filteredParams);
    return response.data;
  }

  // Parties
  async getParties(): Promise<PartyDto[]> {
    const response = await apiClient.get<PartyDto[]>('/api/v1/parties');
    return response.data;
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStatsDto> {
    const response = await apiClient.get<DashboardStatsDto>('/api/v1/dashboard/stats');
    return response.data;
  }

  // Devices
  async registerDevice(data: DeviceRequest): Promise<void> {
    await apiClient.post('/api/v1/devices', data);
  }

  async unregisterDevice(fcmToken: string): Promise<void> {
    await apiClient.delete('/api/v1/devices', { params: { fcmToken } });
  }

  // Sync
  async syncAll(): Promise<SyncResponse> {
    const response = await apiClient.post<SyncResponse>('/api/v1/sync/all');
    return response.data;
  }

  async syncPoliticians(): Promise<SyncResponse> {
    const response = await apiClient.post<SyncResponse>('/api/v1/sync/politicians');
    return response.data;
  }

  async syncExpenses(): Promise<SyncResponse> {
    const response = await apiClient.post<SyncResponse>('/api/v1/sync/expenses');
    return response.data;
  }

  async syncVotes(): Promise<SyncResponse> {
    const response = await apiClient.post<SyncResponse>('/api/v1/sync/votes');
    return response.data;
  }

  async syncSpeeches(): Promise<SyncResponse> {
    const response = await apiClient.post<SyncResponse>('/api/v1/sync/speeches');
    return response.data;
  }

  async syncPropositions(): Promise<SyncResponse> {
    const response = await apiClient.post<SyncResponse>('/api/v1/sync/propositions');
    return response.data;
  }

  async syncPresence(): Promise<SyncResponse> {
    const response = await apiClient.post<SyncResponse>('/api/v1/sync/presence');
    return response.data;
  }
}

export const dataService = new DataService();
export default dataService;
