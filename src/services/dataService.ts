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

const isMocked = process.env.EXPO_PUBLIC_MOCK_ENABLED === 'true';

class DataService {


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
