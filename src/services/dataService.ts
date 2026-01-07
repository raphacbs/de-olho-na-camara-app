import apiClient, { ApiResponse } from './apiClient';
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
  SyncResponse
} from '@/types/api';

class DataService {
  // Politicians
  async getPoliticians(params: { page?: number; size?: number; name?: string; party?: string; state?: string }): Promise<PaginationResponse<PoliticianDto>> {
    const response = await apiClient.get<PaginationResponse<PoliticianDto>>('/api/v1/politicians', params);
    return response.data;
  }

  async getPoliticianById(id: number): Promise<PoliticianDto> {
    const response = await apiClient.get<PoliticianDto>(`/api/v1/politicians/${id}`);
    return response.data;
  }

  // Followed
  async getFollowedPoliticians(params: { page?: number; size?: number }): Promise<PaginationResponse<PoliticianDto>> {
    const response = await apiClient.get<PaginationResponse<PoliticianDto>>('/api/v1/followed', params);
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
    const response = await apiClient.get<ExpenseResponseDTO>(`/api/v1/politicians/${id}/expenses`, params);
    return response.data;
  }

  // Votes
  async getPoliticianVotes(id: number, params: { page?: number; size?: number }): Promise<PaginationResponse<PoliticianVoteDto>> {
    const response = await apiClient.get<PaginationResponse<PoliticianVoteDto>>(`/api/v1/politicians/${id}/votes`, params);
    return response.data;
  }

  async getPoliticianVotesWithProposition(id: number, params: { page?: number; size?: number }): Promise<PaginationResponse<PoliticianVoteWithPropositionDTO>> {
    const response = await apiClient.get<PaginationResponse<PoliticianVoteWithPropositionDTO>>(`/api/v1/politicians/${id}/votes-with-proposition`, params);
    return response.data;
  }

  async getVotingsWithVotes(params: { page?: number; size?: number }): Promise<PaginationResponse<VotingWithVotesDTO>> {
    const response = await apiClient.get<PaginationResponse<VotingWithVotesDTO>>('/api/v1/votings-with-votes', params);
    return response.data;
  }

  // Speeches
  async getPoliticianSpeeches(id: number, params: { page?: number; size?: number }): Promise<PaginationResponse<SpeechDto>> {
    const response = await apiClient.get<PaginationResponse<SpeechDto>>(`/api/v1/politicians/${id}/speeches`, params);
    return response.data;
  }

  // Propositions
  async getPropositions(params: {
    page?: number;
    size?: number;
    politicianId?: string;
    types?: string[];
    statuses?: string[];
    startDate?: string;
    endDate?: string;
  }): Promise<PaginationResponse<PropositionDto>> {
    const response = await apiClient.get<PaginationResponse<PropositionDto>>('/api/v1/propositions', params);
    return response.data;
  }

  async getPoliticianPropositions(id: number, params: { page?: number; size?: number; year?: number }): Promise<PaginationResponse<PropositionDto>> {
    const response = await apiClient.get<PaginationResponse<PropositionDto>>(`/api/v1/politicians/${id}/propositions`, params);
    return response.data;
  }

  // Presence
  async getPoliticianPresence(id: number, params: { page?: number; size?: number }): Promise<PaginationResponse<PresenceDto>> {
    const response = await apiClient.get<PaginationResponse<PresenceDto>>(`/api/v1/politicians/${id}/presence`, params);
    return response.data;
  }



  // Devices
  async registerDevice(data: DeviceRequest): Promise<void> {
    await apiClient.post('/api/v1/devices', data);
  }

  async unregisterDevice(fcmToken: string): Promise<void> {
    await apiClient.delete('/api/v1/devices', { fcmToken });
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
